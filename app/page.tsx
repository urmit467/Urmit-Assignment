"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
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
  const [editingDoc, setEditingDoc] = useState<DocumentType | null>(null);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const [started, setStarted] = useState(false);

  const router = useRouter();



  const fetchDocuments = async () => {

    const snapshot = await getDocs(collection(db, "documents"));

    const docs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<DocumentType, "id">),
    }));

    setDocuments(docs);

  };



  useEffect(() => {
    if (started) fetchDocuments();
  }, [started]);



  const createDocument = async () => {

    const docRef = await addDoc(collection(db, "documents"), {
      title: "Untitled Document",
      author: "Anonymous",
      updatedAt: serverTimestamp(),
    });

    router.push(`/doc/${docRef.id}`);

  };



  const deleteDocument = async (id: string) => {

    const confirmDelete = confirm("Delete this spreadsheet?");

    if (!confirmDelete) return;

    await deleteDoc(doc(db, "documents", id));

    fetchDocuments();

  };



  const openEdit = (docItem: DocumentType) => {

    setEditingDoc(docItem);
    setTitle(docItem.title);
    setAuthor(docItem.author);

  };



  const updateDocument = async () => {

    if (!editingDoc) return;

    const ref = doc(db, "documents", editingDoc.id);

    await updateDoc(ref, {
      title,
      author,
      updatedAt: serverTimestamp(),
    });

    setEditingDoc(null);

    fetchDocuments();

  };



  /* -------------------------------- */
  /* Landing Page */
  /* -------------------------------- */

  if (!started) {

    return (

      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center px-6">

        <h1 className="text-5xl font-bold mb-6">
          Collaborative Spreadsheet
        </h1>

        <p className="max-w-xl text-gray-400 mb-8 text-lg">
          A lightweight real-time collaborative spreadsheet built with
          Next.js and Firebase. Create documents, edit cells, collaborate
          with others in real time, and manage your spreadsheets easily.
        </p>

        <button
          onClick={() => setStarted(true)}
          className="bg-white text-black px-8 py-3 rounded-md text-lg font-semibold hover:bg-gray-200 transition"
        >
          Get Started
        </button>

      </div>

    );

  }



  /* -------------------------------- */
  /* Dashboard */
  /* -------------------------------- */

  return (

    <div className="min-h-screen bg-black text-white flex justify-center">

      <div className="w-full max-w-5xl p-10">


        {/* Header */}

        <div className="flex justify-between items-center mb-12">

          <div>

            <h1 className="text-3xl font-semibold">
              Spreadsheets
            </h1>

            <p className="text-gray-400 text-sm mt-1">
              Manage your collaborative documents
            </p>

          </div>

          <button
            onClick={createDocument}
            className="bg-white text-black px-6 py-2 rounded hover:bg-gray-200 transition"
          >
            + New Spreadsheet
          </button>

        </div>



        {/* Empty State */}

        {documents.length === 0 && (

          <div className="text-center text-gray-400 mt-20">

            <p className="text-lg">
              No spreadsheets yet
            </p>

            <p className="text-sm mt-2">
              Click "New Spreadsheet" to create one
            </p>

          </div>

        )}



        {/* Spreadsheet Grid */}

        <div className="grid md:grid-cols-2 gap-6">

          {documents.map((docItem) => (

            <div
              key={docItem.id}
              className="bg-white text-black rounded-xl p-6 border border-gray-200 hover:shadow-xl transition"
            >

              <h2 className="text-lg font-semibold mb-1">
                📄 {docItem.title}
              </h2>

              <p className="text-sm text-gray-600">
                Author: {docItem.author}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                Last Modified:{" "}
                {docItem.updatedAt?.toDate
                  ? docItem.updatedAt.toDate().toLocaleString()
                  : "Just now"}
              </p>


              <div className="flex gap-3 mt-5">

                <button
                  onClick={() => router.push(`/doc/${docItem.id}`)}
                  className="flex-1 border border-black py-1 rounded hover:bg-black hover:text-white transition"
                >
                  Open
                </button>

                <button
                  onClick={() => openEdit(docItem)}
                  className="flex-1 border border-blue-500 text-blue-500 py-1 rounded hover:bg-blue-500 hover:text-white transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteDocument(docItem.id)}
                  className="flex-1 border border-red-500 text-red-500 py-1 rounded hover:bg-red-500 hover:text-white transition"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>



        {/* Edit Modal */}

        {editingDoc && (

          <div className="fixed inset-0 bg-black/60 flex items-center justify-center">

            <div className="bg-white text-black p-6 rounded-lg w-96">

              <h2 className="text-lg font-semibold mb-4">
                Edit Document
              </h2>

              <input
                className="border w-full p-2 mb-3"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
              />

              <input
                className="border w-full p-2 mb-4"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author"
              />

              <div className="flex gap-3">

                <button
                  onClick={updateDocument}
                  className="flex-1 bg-black text-white py-2 rounded"
                >
                  Save
                </button>

                <button
                  onClick={() => setEditingDoc(null)}
                  className="flex-1 border border-black py-2 rounded"
                >
                  Cancel
                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>

  );
}