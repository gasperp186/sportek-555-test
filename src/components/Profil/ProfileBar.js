/* eslint-disable @next/next/no-img-element */
"use client";

import classes from "./ProfileBar.module.css";

import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db, auth } from "@/lib/firebase"; 
import { doc, getDoc } from "firebase/firestore";

export default function ProfileBar({ activeTab, onSelectTab }) {

  const [currentUser, setCurrentUser] = useState(null);
  const [dbUser, setDbUser] = useState(null);



  useEffect(() => {
    // Poslušalec za prijavo uporabnika
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if(user) {
        const userRef = doc(db, "users", user.uid); // Pravilno
        const userSnap = await getDoc(userRef);

        if(userSnap.exists()) {
          setDbUser(userSnap.data());
        }
      }
    });

    // Počistimo ob zaprtju strani
    return () => unsubscribe();
  }, [auth]);

  // Pripravimo podatke za enostaven izpis (varnostna mreža)
  const name = currentUser?.name || "Neznano";

  const email = currentUser?.email || "Ni naloženo...";
 


  const initial = (dbUser?.name || "U").trim().charAt(0).toUpperCase();

  const itemClass = (tab) =>
    `${classes.item} ${activeTab === tab ? classes.active : ""}`;

  return (
    <div className={classes.leftCol}>
      <div className={classes.leftCard}>
        <header className={classes.head}>
          
          <div>
            <div className={classes.name}>{dbUser?.name} {dbUser?.surname}</div>
            <div className={classes.email}>{dbUser?.email}</div>
          </div>
        </header>

        <nav className={classes.menu}>
          <button
            type="button"
            className={itemClass("profil")}
            onClick={() => onSelectTab("profil")}
          >
            Moj profil
          </button>

          <button
            type="button"
            className={itemClass("tekmovanja")}
            onClick={() => onSelectTab("tekmovanja")}
          >
            Moja tekmovanja
          </button>

          <button
            type="button"
            className={itemClass("uredi")}
            onClick={() => onSelectTab("uredi")}
          >
            Uredi profil
          </button>

          <button
            type="button"
            className={itemClass("varnost")}
            onClick={() => onSelectTab("varnost")}
          >
            Varnost
          </button>

          <button
            type="button"
            className={itemClass("varnost")}
            onClick={() => alert("Kasneje: Firebase signOut()")}
          >
            Odjava
          </button>
        </nav>
      </div>
    </div>
  );
}
