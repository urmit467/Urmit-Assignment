"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

type DocumentType = {
  id: string;
  title: string;
  author: string;
  updatedAt?: any;
};

export default function Dashboard() {
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const router = useRouter();

  // fetch documents
  const fetchDocuments = async () => {
    const snapshot = await getDocs(collection(db, "documents"));

    const docs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<DocumentType, "id">),
    }));

    setDocuments(docs);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // create new document
  const createDocument = async () => {
    const docRef = await addDoc(collection(db, "documents"), {
      title: "Untitled Document",
      author: "Anonymous",
      updatedAt: serverTimestamp(),
    });

    router.push(`/doc/${docRef.id}`);
  };

  return (
    <main className="p-10 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Documents</h1>

      <button
        onClick={createDocument}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
      >
        Create New Document
      </button>

      <div className="space-y-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{doc.title}</h2>
              <p className="text-sm text-gray-500">
                Author: {doc.author}
              </p>
              <p className="text-sm text-gray-500">
                Last Modified:{" "}
                {doc.updatedAt?.toDate
                  ? doc.updatedAt.toDate().toLocaleString()
                  : "Just now"}
              </p>
            </div>

            <button
              onClick={() => router.push(`/doc/${doc.id}`)}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Open
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}