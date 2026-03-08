"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { doc, setDoc } from "firebase/firestore"

type Props = {
  docId: string
  cellId: string
  data?: {
    value?: string
    isBold?: boolean
    italic?: boolean
    color?: string
  }
}

export default function Cell({ docId, cellId, data }: Props) {

  const [value, setValue] = useState("")
  const [isBold, setIsBold] = useState(false)
  const [italic, setItalic] = useState(false)
  const [color, setColor] = useState("#000000")

  useEffect(() => {

    if (!data) return

    setValue(data.value || "")
    setIsBold(data.isBold || false)
    setItalic(data.italic || false)
    setColor(data.color || "#000000")

  }, [data])

  const saveCell = async () => {

    const ref = doc(db, "documents", docId)

    await setDoc(
      ref,
      {
        cells: {
          [cellId]: {
            value,
            isBold,
            italic,
            color
          }
        }
      },
      { merge: true }
    )

  }

  return (

    <td className="border p-0">

      <div className="flex gap-1 p-1 bg-gray-100 text-xs">

        <button onClick={() => setIsBold(!isBold)}>
          B
        </button>

        <button onClick={() => setItalic(!italic)}>
          I
        </button>

        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
        />

      </div>

      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={saveCell}
        className="w-full p-2 outline-none"
        style={{
          fontWeight: isBold ? "bold" : "normal",
          fontStyle: italic ? "italic" : "normal",
          color
        }}
      />

    </td>

  )
}