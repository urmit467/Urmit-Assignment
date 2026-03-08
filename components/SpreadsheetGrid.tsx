"use client"

import Cell from "./Cell"
import { CellData } from "@/types/cell"
import { useState } from "react"

type Props = {
  docId: string
  cells: Record<string, CellData>
}

const ROWS = 20
const COLS = 10

export default function SpreadsheetGrid({ docId, cells }: Props) {

  const [colWidths, setColWidths] = useState<number[]>(Array(COLS).fill(120))

  const cols = Array.from({ length: COLS }, (_, i) =>
    String.fromCharCode(65 + i)
  )

  const rows = Array.from({ length: ROWS }, (_, i) => i + 1)

  const startResize = (index: number, startX: number) => {

    const startWidth = colWidths[index]

    const onMove = (e: MouseEvent) => {

      const newWidths = [...colWidths]

      newWidths[index] = Math.max(80, startWidth + (e.clientX - startX))

      setColWidths(newWidths)

    }

    const stop = () => {

      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseup", stop)

    }

    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseup", stop)

  }

  return (

    <table className="border-collapse w-full">

      <thead>

        <tr>

          <th className="border w-10"></th>

          {cols.map((c, i) => (

            <th
              key={c}
              style={{ width: colWidths[i] }}
              className="border bg-gray-200 relative select-none"
            >

              {c}

              <div
                onMouseDown={(e) => startResize(i, e.clientX)}
                className="absolute right-0 top-0 h-full w-1 cursor-col-resize bg-gray-400"
              />

            </th>

          ))}

        </tr>

      </thead>

      <tbody>

        {rows.map((r) => (

          <tr key={r}>

            <th className="border bg-gray-200 w-10">
              {r}
            </th>

            {cols.map((c) => {

              const id = `${c}${r}`

              return (

                <Cell
                  key={id}
                  docId={docId}
                  cellId={id}
                  data={cells[id]}
                />

              )

            })}

          </tr>

        ))}

      </tbody>

    </table>

  )

}