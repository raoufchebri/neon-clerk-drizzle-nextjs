import { UserButton } from "@clerk/nextjs";
import { db } from "./db";
import { Element, ElementVote, ElementVotes, Elements } from "./db/schema";
import { eq, sql } from 'drizzle-orm'
import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation'
import { ElementComponent } from "./components/element";
import Link from 'next/link'

export const dynamic = 'force-dynamic';

const getData = async () => {
  const user = await currentUser()

  if (!user) {
    throw new Error('user must be defined')
  }

  const vote = await db.select().from(ElementVotes).where(
    eq(ElementVotes.userId, user.id)
  )

  const elements = await db.
    select({
      votes: sql<number>`COALESCE(COUNT(DISTINCT ${ElementVotes.userId}), 0)`,
      name: Elements.name,
      atomicNumber: Elements.atomicNumber,
      symbol: Elements.symbol
    })
    .from(Elements)
    .leftJoin(ElementVotes, eq(Elements.atomicNumber, ElementVotes.elementId))
    .groupBy(sql`${Elements.name},${Elements.atomicNumber}`)


  return { elements, vote };
};

export default async function Home() {
  const { elements, vote } = await getData();
  let message = 'Vote for your favourite element by clicking on it.'
  
  if (vote[0]) {
    message = `You voted for ${elements.find(el => el.atomicNumber === vote[0].elementId)?.name}! Change your vote by clicking an element.`
    elements.sort((e1, e2) => {
      return e1.votes > e2.votes ? -1 : 1
    })
  }

  return (
    <main className="min-h-screen bg-[#1A1A1A]">
      <div className="py-8">
        <p className="text-lg text-center">{message}</p>
      </div>
      <div className="flex items-center justify-center">
        <ul className="grid grid-cols-2 md:grid-cols-5 gap-5">
          {
            elements.map(el => {
              return (
                <Link key={el.atomicNumber}  href={`/voted/?elementId=${el.atomicNumber}`}>
                  <ElementComponent atomicNumber={el.atomicNumber} symbol={el.symbol} name={el.name}>
                    <small className="pt-4 text-xs text-gray-800">Votes: {el.votes}</small>
                  </ElementComponent>
                </Link>
              )
            })
          }
        </ul>
      </div>
    </main>
  );
}
