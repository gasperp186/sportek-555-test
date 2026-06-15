"use client";
import classes from "./PrijavniObrazec.module.css";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, getDoc } from "firebase/firestore";
import { formatDate } from "@/components/formatDate";

// Uvozi tvoj LoadingSpinner komponente (prilagodi pot glede na svojo strukturo)
import LoadingSpinner from "@/components/LoadingSpinner";

export default function PrijavniObrazec({ competition }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const comp = competition;
  const [userName, setUsername] = useState("");
  
  // Stanja za proces
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);

  const params = useParams();
  const id = params.id;  
  const userEmail = auth.currentUser?.email || "";

  useEffect(() => {
    async function fetchUserData() {
      if (!auth.currentUser) return;
      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);

        if(userSnap.exists()) {
          setUsername(userSnap.data().name);
        }
      } catch (err) {
        console.error("Napaka pri pridobivanju podatkov uporabnika:", err);
      }
    }
    fetchUserData();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    if (isLoading) return;

    if (!name.trim()) {
      setError("Prosim, vnesite ime ekipe.");
      return;
    }

    if (!id) {
      setError("Napaka: ID tekmovanja ni najden.");
      return;
    }

    // Vklopimo tvoj celozaslonski spinner
    setIsLoading(true);
    setError(null);

    const userId = auth.currentUser.uid;
    const userEmail = auth.currentUser.email;

    try {
      const novaPrijava = {
        userName: userName,
        teamName: name,
        applicantId: userId,
        applicantEmail: userEmail,
        status: "pending",
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, "competitions", id, "applications"), novaPrijava);

      // Izklopimo spinner in prikažemo uspeh
      setIsLoading(false);
      setIsSuccess(true);

      // Počakamo 2.5 sekundi pred preusmeritvijo
      setTimeout(() => {
        router.push(`/Competitions/${id}`);
      }, 2500);

    } catch (error) {
      console.log(error);
      setError("Prišlo je do napake pri oddaji prijave. Poskusite ponovno.");
      setIsLoading(false);
    }
  }

  // 1. KORAK: Če Firebase obdeluje prijavo, vrnemo striktno SAMO tvoj LoadingSpinner
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // 2. KORAK: Če se ne nalaga, izrišemo normalno stran (obrazec ali uspeh)
  return (
    <div className={classes.page}>
      <form className={classes.card} onSubmit={handleSubmit}>
        <h2 className={classes.title}>Prijava ekipe</h2>

        

        {isSuccess ? (
          /* USPEŠNO ODDAJNA PRIJAVA OVERLAY/ZASLON */
          <div style={{
            textAlign: 'center',
            padding: '30px 10px',
            color: '#10b981',
            fontSize: '16px',
            fontWeight: '600',
            lineHeight: '1.5'
          }}>
            Prijava je bila uspešno oddana
            
          </div>
        ) : (
          /* KLASIČEN OBRAZEC */
          <>
                        <p className={classes.subtitle}>Izpolnite podatke za prijavo na tekmovanje</p>

            <div className={classes.row2}>
              <div className={classes.control}>
                
                <label className={classes.label}>Ime ekipe/tekmovalcev</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className={classes.input}
                  placeholder="Vnesite ime..."
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError(null);
                  }}
                />
              </div>

              <div className={classes.control}>
                <label className={classes.label}>E-MAIL</label>
                <p style={{ marginTop: '13px', fontWeight: '500' }}>{userEmail}</p>
              </div>
            </div>

            <div className={classes.checkboxRow}>
              <label className={classes.label}>
                Prijave zbiramo do {formatDate(comp?.registrationDeadline) || "Datum ni določen"}
              </label>        
            </div>

            <div className={classes.actions} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button type="submit" className={classes.btnPrimary}>
                Pošlji prijavo
              </button>

              {error && (
                <div style={{
                  color: "#ef4444",
                  fontSize: "14px",
                  fontWeight: "600",
                  textAlign: "center",
                  marginTop: "4px"
                }}>
                  {error}
                </div>
              )}
            </div>
          </>
        )}
      </form>
    </div>
  );
}