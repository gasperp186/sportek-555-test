
"use client";
import classes from "./PrijavniObrazec.module.css";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";


export default function PrijavniObrazec() {

  const [name, setName] = useState("");

  const [userName, setUsername] = useState("");

  const params = useParams();
  const id = params.id;  
  const userEmail = auth.currentUser.email;

  useEffect(() => {

    async function fetchUserData() {

      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);

      if(userSnap.exists()) {
        setUsername(userSnap.data().name);
      }


    }
      fetchUserData();


    
  })


  async function handleSubmit(e) {

    e.preventDefault();

    

    const userId = auth.currentUser.uid;
    const userEmail = auth.currentUser.email;

    if (!id) {
    alert("Napaka: ID tekmovanja ni najden.");
    return;
  }

    try {

       const novaPrijava = {
      
      userName: userName,
      teamName: name,
      leaderId: userId,
      leaderEmail: userEmail,
      status: "pending",
      createdAt: serverTimestamp()
    };

    await addDoc(collection(db, "competitions", id, "applications"), novaPrijava);

    alert("Prijava uspešno oddana");

    }
    catch (error) {
      console.log(error);
    }

   

    
  }


  return (
    <div className={classes.page}>
      <form className={classes.card}>
        <h2 className={classes.title}>Prijava ekipe</h2>
        <p className={classes.subtitle}>Izpolnite podatke za prijavo na tekmovanje</p>

        <div className={classes.row2}>
          <div className={classes.control}>
            <label className={classes.label}>Ime ekipe/tekmovalcev</label>
            <input
              id="name"
              name="name"
              type="text"
              className={classes.input}
              placeholder="npr. Ekipa Thunder"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={classes.control}>
            <label className={classes.label}>E-MAIL</label>
            <p>{userEmail}</p>
          </div>
        </div>

        {/* CHECKBOX */}
        <div className={classes.checkboxRow}>
          <input type="checkbox" id="agree" />
          <label htmlFor="agree">Strinjam se s pogoji prijave</label>
        </div>

        {/* GUMB */}
        <div className={classes.actions}>
          <button onClick={handleSubmit} type="submit" className={classes.btnPrimary}>
            Pošlji prijavo
          </button>
        </div>
      </form>
    </div>
  );
}
