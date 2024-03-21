import { WebhookEvent } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { db } from '@/app/db'
import { headers } from 'next/headers'
import { Webhook } from 'svix'
import { Users } from '@/app/db/schema'
import { log } from '@/app/log'
import { eq } from 'drizzle-orm'

async function validateRequest(request: Request, secret: string) {
  const payloadString = await request.text()
  const headerPayload = headers()

  const svixHeaders = {
    'svix-id': headerPayload.get('svix-id')!,
    'svix-timestamp': headerPayload.get('svix-timestamp')!,
    'svix-signature': headerPayload.get('svix-signature')!,
  }
  const wh = new Webhook(secret)

  try {
    return wh.verify(payloadString, svixHeaders) as WebhookEvent
  } catch (e) {
    console.error('incoming webhook failed verification')
    return
  }
}

export async function POST(req: Request): Promise<NextResponse> {
  if (!process.env.CLERK_WEBHOOK_SECRET) {
    throw new Error('CLERK_WEBHOOK_SECRET environment variable is missing')
  }

  const payload = await validateRequest(req, process.env.CLERK_WEBHOOK_SECRET)

  if (!payload) {
    return NextResponse.json(
      { error: 'webhook verification failed or payload was malformed' },
      { status: 400 }
    )
  }

  const { type, data } = payload

  log.trace(`clerk webhook payload: ${{ data, type }}`)

  if (type === 'user.created') {
    return createUser(data.id, data.created_at)
  } else if (type === 'user.deleted') {
    return deleteUser(data.id)
  } else {
    log.warn(`${req.url} received event type "${type}", but no handler is defined for this type`)
    return NextResponse.json({
      error: `uncreognised payload type: ${type}`
    }, {
      status: 400
    })
  }
}

async function createUser(id: string, createdAt: number) {
  log.info('creating user due to clerk webhook')
  await db.insert(Users).values({
    id,
    clerkCreateTs: new Date(createdAt)
  })

  return NextResponse.json({
    message: 'user created'
  }, { status: 200 })
}

async function deleteUser(id?: string) {
  if (id) {
    log.info('delete user due to clerk webhook')
    await db.delete(Users).where(
      eq(Users.id, id)
    )

    return NextResponse.json({
      message: 'user deleted'
    }, { status: 200 })
  } else {
    log.warn('clerk sent a delete user request, but no user ID was included in the payload')
    return NextResponse.json({
      message: 'ok'
    }, { status: 200 })
  }
}
