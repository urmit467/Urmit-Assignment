"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import SpreadsheetGrid from "@/components/SpreadSheetGrid";
import { useParams } from "next/navigation";

type CellsType = {
  [key: string]: string;
};

export default function DocumentPage() {
  const params = useParams();
  const docId = params.id as string;

  const [cells, setCells] = useState<CellsType>({});

  useEffect(() => {
    const ref = doc(db, "documents", docId);

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const data = snapshot.data();
      if (data && data.cells) {
        setCells(data.cells);
      }
    });

    return () => unsubscribe();
  }, [docId]);

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">Spreadsheet Editor</h1>

      <SpreadsheetGrid docId={docId} cells={cells} />
    </main>
  );
}