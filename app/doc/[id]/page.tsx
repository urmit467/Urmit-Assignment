"use client";

import { useEffect, useState } from "react";
import {
  doc,
  onSnapshot,
  collection,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams } from "next/navigation";
import SpreadsheetGrid from "@/components/SpreadsheetGrid";
import Presence from "@/components/Presence";
import IdentityModal from "@/components/IdentityModal";

type CellData = {
  value: string;
  bold?: boolean;
  italic?: boolean;
  color?: string;
};

type User = {
  id: string;
  name: string;
  color: string;
};

export default function Editor() {
  const params = useParams();
  const docId = params.id as string;

  const [cells, setCells] = useState<Record<string, CellData>>({});
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState<string | null>(null);

  const [userId] = useState(() => crypto.randomUUID());

  const [color] = useState(
    () => "#" + Math.floor(Math.random() * 16777215).toString(16)
  );

  /* Load username */

  useEffect(() => {
    const saved = sessionStorage.getItem("spreadsheet-user");

    if (saved) {
      setName(saved);
    }
  }, []);

  const handleNameSubmit = (newName: string) => {
    sessionStorage.setItem("spreadsheet-user", newName);
    setName(newName);
  };

  /* Realtime spreadsheet */

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

  /* Register presence */

  useEffect(() => {
    if (!name) return;

    const presenceRef = doc(db, "presence", userId);

    setDoc(presenceRef, {
      docId,
      name,
      color,
      lastActive: serverTimestamp(),
    });

    return () => {
      deleteDoc(presenceRef);
    };
  }, [docId, name, userId, color]);

  /* Active users */

  useEffect(() => {
    const ref = collection(db, "presence");

    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const activeUsers: User[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();

        if (data.docId === docId) {
          activeUsers.push({
            id: doc.id,
            name: data.name,
            color: data.color,
          });
        }
      });

      setUsers(activeUsers);
    });

    return () => unsubscribe();
  }, [docId]);

  /* CSV Export */

  const exportCSV = () => {
    const rows = 20;
    const cols = 10;

    const grid: string[][] = [];

    for (let r = 1; r <= rows; r++) {
      const row: string[] = [];

      for (let c = 0; c < cols; c++) {
        const cellId = `${String.fromCharCode(65 + c)}${r}`;
        row.push(cells[cellId]?.value || "");
      }

      grid.push(row);
    }

    const csvContent = grid.map((row) => row.join(",")).join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "spreadsheet.csv";
    link.click();
  };

  /* Identity modal */

  if (!name) {
    return <IdentityModal onSubmit={handleNameSubmit} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">

      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="flex justify-between items-center mb-6">

          <div>

            <h1 className="text-3xl font-bold text-gray-800">
              Realtime Spreadsheet
            </h1>

            <p className="text-sm text-gray-500">
              Document ID: {docId}
            </p>

          </div>

          <button
            onClick={exportCSV}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Export CSV
          </button>

        </div>

        {/* Active Users */}

        <div className="bg-white p-4 rounded-xl shadow mb-6">
          <Presence users={users} />
        </div>

        {/* Spreadsheet */}

        <div className="bg-white rounded-xl shadow-lg p-4 overflow-auto">

          <SpreadsheetGrid
            docId={docId}
            cells={cells}
          />

        </div>

      </div>

    </div>
  );
}