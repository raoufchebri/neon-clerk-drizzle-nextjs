import { UserButton } from "@clerk/nextjs";
import { db } from "@/app/db";
import { ElementVotes } from "@/app/db/schema";
import { eq } from 'drizzle-orm'
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic';

const voteAndGetData = async (elementId?: string) => {
  if (!elementId) {
    return redirect('/')
  }

  const user = await currentUser()

  if (!user) {
    throw new Error('user must be defined')
  }

  const existingVote = await db
    .select()
    .from(ElementVotes)
    .where(
      eq(ElementVotes.userId, user.id)
    )

  if (existingVote[0]) {
    // User has already voted, update it
    return db
      .update(ElementVotes)
      .set({
        elementId: parseInt(elementId)
      })
      .where(eq(ElementVotes.userId, user.id))
      .returning()
  }
};

export default async function Voted({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { elementId } = searchParams

  await voteAndGetData(elementId as string)
  
  return redirect(`/?element=${elementId}`)
}
