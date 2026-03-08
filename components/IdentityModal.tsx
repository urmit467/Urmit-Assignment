"use client";

import { useState } from "react";

export default function IdentityModal({
  onSubmit,
}: {
  onSubmit: (name: string) => void;
}) {
  const [name, setName] = useState("");

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-80">

        <h2 className="text-lg font-semibold mb-4">
          Enter Your Name
        </h2>

        <input
          className="border w-full p-2 mb-4"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
          onClick={() => name && onSubmit(name)}
        >
          Continue
        </button>

      </div>
    </div>
  );
}