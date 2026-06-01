"use client";

import Link from "next/link";
import classes from "./MyCompetitions.module.css";
import { MapPin, Calendar, Pencil, Eye } from "lucide-react";
import { competitions as localCompetitions } from "@/data/Competitions"; // Preimenovano, da ne javi konflikta z usestate
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { QrCode2Rounded } from "@mui/icons-material";
import { formatDate } from "@/components/formatDate";

export default function MyCompetitions() {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const q = query(collection(db, "competitions"), where("createdBy", "==", user.uid));
          const querySnapshot = await getDocs(q);

          const q2 = query(collection(db, "competitions"), where("editors", "array-contains", user.uid));
          const querySnapshot2 = await getDocs(q2);

          const list = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          const list2 = querySnapshot2.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          const zdruzeniSeznam = [...list, ...list2];

          setCompetitions(zdruzeniSeznam);
        } catch (error) {
          console.error("Napaka:", error);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className={classes.page}><p className={classes.empty}>Nalaganje...</p></div>; // Opcijsko dodano za lepši UX
  }

  return (
    <div className={classes.page}>
      <section className={classes.rightCol}>
        <div className={classes.rightCard}>
          <div className={classes.headRight}>
            <h2 className={classes.naslov}>Moja tekmovanja</h2>
          </div>

          <div className={classes.list}>
            {competitions.length === 0 ? (
              <p className={classes.empty}>Ni še dodanih tekmovanj.</p>
            ) : (
              competitions.map((comp) => (
                <div key={comp.id} className={classes.item}>
                  <div className={classes.info}>
                    <h3 className={classes.title}>{comp.title}</h3>

                    {/* POPRAVEK: <p> spremenjen v <div>, kar prepreči hydration error */}
                    <div className={classes.meta}>
                      {comp.mode === "bracket" || comp.mode === "knockout" ? (
                        <div className={classes.majhnNaslov}>
                          <strong>Datum: </strong> {
                            !comp.endDate || comp.startDate === comp.endDate 
                              ? formatDate(comp.startDate) 
                              : `${formatDate(comp.startDate)} - ${formatDate(comp.endDate)}`
                          }
                        </div>
                      ) : (
                        <div className={classes.majhnNaslov}>
                          <strong>Sezona: </strong> {comp.season}
                        </div>
                      )}
                      
                      <span className={classes.metaSpacer} />
                      
                      <div className={classes.majhnNaslov}>
                        <strong>Kraj: </strong> {comp.city}
                      </div>
                       <div className={classes.majhnNaslov}>
                         <strong>Šport: </strong> {comp.sport}
                       </div>
                     
                  
                    </div>

                   
                  </div>

                  <div className={classes.actions}>
                    {/* Ogled tekmovanja */}
                    <Link className={classes.ghostBtn} href={`/Competitions/${comp.id}`}>
                      Ogled
                    </Link>

                    {/* Urejanje tekmovanja */}
                    <Link className={classes.urediBtn} href={`/Competitions/${comp.id}/edit`}>
                      Uredi
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}