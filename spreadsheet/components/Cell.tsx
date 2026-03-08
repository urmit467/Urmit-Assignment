"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

type Props = {
  docId: string;
  cellId: string;
  value: string;
};

export default function Cell({ docId, cellId, value }: Props) {

  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const saveCell = async () => {

    const ref = doc(db, "documents", docId);

    await setDoc(
      ref,
      {
        cells: {
          [cellId]: localValue,
        },
      },
      { merge: true }
    );

  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {

    if (e.key === "Enter") {

      e.preventDefault();

      await saveCell();

      (e.target as HTMLInputElement).blur(); // exit editing

    }

  };

  return (
    <td className="border p-0">

      <input
        className="w-full p-2 outline-none focus:bg-gray-100"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={saveCell}
        onKeyDown={handleKeyDown}
      />

    </td>
  );
}