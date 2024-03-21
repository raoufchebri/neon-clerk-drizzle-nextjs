import { db } from "./src/app/db"
import { Elements } from "./src/app/db/schema"

type ElementData = {
  elements: {
    name: string
    number: number
    symbol: string
  }[]
}

async function main () {
  console.log('Downloading seed data...')
  const res = await fetch('https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json')

  if (res.status !== 200) {
    throw new Error(`received status code ${res.status} when fetching elements JSON`)
  }
  console.log('Parsing seed data...')
  const elementJson = await res.json() as ElementData

  const values = elementJson.elements.map(el => {
    const { symbol, name, number } = el

    return {
      symbol, name, atomicNumber: number
    }
  })

  console.log('Delete existing element data...')
  await db.delete(Elements)
  console.log('Insert new element data...')
  await db.insert(Elements).values(values)
}

main()
