"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

type Props = {
  docId: string;
  cellId: string;
  value: string;
};

export default function Cell({ docId, cellId, value }: Props) {
  const [localValue, setLocalValue] = useState(value);

  const saveCell = async () => {
    const ref = doc(db, "documents", docId);

    await updateDoc(ref, {
      [`cells.${cellId}`]: localValue,
    });
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