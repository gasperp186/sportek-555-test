"use client";

import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function FirebaseTestPage() {

  async function createTest() {
    const ref = await addDoc(collection(db, "competitions"), {
      title: "Test Competition",
      createdAt: serverTimestamp(),
    });

    alert("Created: " + ref.id);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Firebase test</h1>
      <button onClick={createTest}>
        Create test competition
      </button>
    </div>
  );
}
