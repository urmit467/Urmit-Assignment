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

type User = {
  id: string;
  name: string;
  color: string;
};

export default function Editor() {

  const params = useParams();
  const docId = params.id as string;

  const [cells, setCells] = useState<{ [key: string]: string }>({});
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState<string | null>(null);

  const [userId] = useState(() => crypto.randomUUID());

  const [color] = useState(
    () => "#" + Math.floor(Math.random() * 16777215).toString(16)
  );


  useEffect(() => {

    const savedName = sessionStorage.getItem("spreadsheet-user");

    if (savedName) {
      setName(savedName);
    }

  }, []);

  const handleNameSubmit = (newName: string) => {

    sessionStorage.setItem("spreadsheet-user", newName);
    setName(newName);

  };


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


  if (!name) {
    return <IdentityModal onSubmit={handleNameSubmit} />;
  }


  return (

    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-6xl mx-auto">

        <h1 className="text-2xl font-semibold mb-4">
          Spreadsheet Editor
        </h1>

        {/* Active Users */}
        <Presence users={users} />

        {/* Spreadsheet */}
        <div className="bg-white border rounded-lg shadow overflow-hidden mt-4">
          <SpreadsheetGrid
            docId={docId}
            cells={cells}
          />
        </div>

      </div>

    </div>

  );
}