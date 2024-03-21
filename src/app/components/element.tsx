import { Element } from "../db/schema"

export function ElementComponent (props: { name: string, symbol: string, atomicNumber: number, children: any }) {
  const { atomicNumber, name, symbol, children } = props
  
  return (
    <li className="cursor-pointer relative flex flex-col text-center p-5 rounded-md bg-[#00E699] transition-colors hover:bg-[#00e5BF] text-[black]">
      <p className="absolute top-2 left-2 text-sm">
        {atomicNumber}
      </p>
      <h2 className="text-2xl font-medium">{symbol}</h2>
      <p className="text-base">{name}</p>
      {children}
    </li>
  )
}
