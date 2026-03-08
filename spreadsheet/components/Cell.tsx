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

  // Update local value when firestore changes
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

  return (
    <td className="border p-0">
      <input
        className="w-full p-2 outline-none"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={saveCell}
      />
    </td>
  );
}