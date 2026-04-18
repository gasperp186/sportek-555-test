"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/lib/firebase"; 
import classes from "./EditProfile.module.css";

export default function EditProfile() {
  const [dbUser, setDbUser] = useState({
    name: "",
    surname: "",
  });
  const [currentUser, setCurrentUser] = useState(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

  // 1. Poslušalec za prijavo in nalaganje podatkov iz baze
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setDbUser(userSnap.data());
          }
        } catch (error) {
          console.error("Napaka pri pridobivanju podatkov:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  // 2. Funkcija za posodabljanje stanja ob tipkanju
  // POMEMBNO: 'name' v inputu se mora ujemati s ključem v dbUser objektu
  function handleChange(e) {
    const { name, value } = e.target;
    setDbUser((prev) => ({
      ...prev,
      [name]: value
    }));
    if (saved) setSaved(false);
  }

  // 3. Funkcija za shranjevanje v Firestore
  async function handleSubmit(e) {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        name: dbUser.name,
        surname: dbUser.surname,
      });
      setSaved(true);
      
      // Sporočilo o uspehu skrijemo po 3 sekundah
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error("Napaka pri shranjevanju:", error);
      alert("Napaka pri shranjevanju podatkov.");
    }
  }

  if (loading) return <div className={classes.page}>Nalagam profil...</div>;

  return (
    <div className={classes.page}>
      <section className={classes.rightCol}>
        <div className={classes.rightCard}>
          <div className={classes.headRight}>
            <h2 className={classes.naslov}>Uredi profil</h2>
          </div>
          <div className={classes.divider} />

          <form onSubmit={handleSubmit} className={classes.form}>
            <label>
              Ime
              <input
                type="text"
                name="name" // Ujemati se mora z dbUser.name
                value={dbUser?.name || ""}
                onChange={handleChange}
                placeholder="Vnesi ime"
                required
              />
            </label>

            <label>
              Priimek
              <input
                type="text"
                name="surname" // Ujemati se mora z dbUser.surname
                value={dbUser?.surname || ""}
                onChange={handleChange}
                placeholder="Vnesi priimek"
                required
              />
            </label>

           

            <button type="submit" className={classes.primary}>
              Shrani spremembe
            </button>

            {saved && (
              <p className={classes.success}>✅ Spremembe so shranjene</p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}