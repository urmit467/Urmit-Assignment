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

  const [userId] = useState(() => crypto.randomUUID());

  const [name, setName] = useState<string | null>(null);

  const [color] = useState(
    () => "#" + Math.floor(Math.random() * 16777215).toString(16)
  );

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

  // Load saved name
  useEffect(() => {
    const savedName = localStorage.getItem("spreadsheet-user");

    if (savedName) {
      setName(savedName);
    }
  }, []);

  const handleNameSubmit = (newName: string) => {
    localStorage.setItem("spreadsheet-user", newName);
    setName(newName);
  };

  // Realtime spreadsheet updates
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



  // Register presence
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



  // Listen for active users
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



  // Show identity popup if user not set
  if (!name) {
    return <IdentityModal onSubmit={handleNameSubmit} />;
  }



  return (
    <main className="p-6">

      <h1 className="text-xl font-bold mb-4">
        Spreadsheet Editor
      </h1>

      {/* Active users */}
      <Presence users={users} />

      {/* Spreadsheet */}
      <SpreadsheetGrid
        docId={docId}
        cells={cells}
      />

    </main>
  );
}