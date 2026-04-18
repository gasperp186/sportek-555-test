"use client";

import Link from "next/link";
import classes from "./MyCompetitions.module.css";
import { MapPin, Calendar, Pencil, Eye } from "lucide-react";
import { competitions } from "@/data/Competitions";
import { collection, query, where, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { QrCode2Rounded } from "@mui/icons-material";


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
      setLoading(false); // Ko končaš, ustavi nalaganje
    } else {
      setLoading(false);
    }
  });

  return () => unsubscribe();
}, []); // <--- TA DEL JE NUJEN ZA ZAČETNIKA (pomeni: zaženi samo ob nalaganju strani)



  return (
    <div className={classes.page}>
      <section className={classes.rightCol}>
        <div className={classes.rightCard}>
          <div className={classes.headRight}>
            <h2 className={classes.naslov}>Moja tekmovanja</h2>
          </div>

          <div className={classes.divider} />

          <div className={classes.list}>
            {competitions.length === 0 ? (
              <p className={classes.empty}>Ni še dodanih tekmovanj.</p>
            ) : (
              competitions.map((comp) => (
                <div key={comp.id} className={classes.item}>
                  <div className={classes.info}>
                    <h3 className={classes.title}>{comp.title}</h3>

                    <p className={classes.meta}>
                      <Calendar size={20} strokeWidth={2} className={classes.icon} />
                      {comp.date}

                      <span className={classes.metaSpacer} />

                      <MapPin size={20} strokeWidth={2} className={classes.icon} />
                      {comp.city}
                    </p>

                    <p className={classes.metaSmall}>
                      Šport: <b>{comp.sport}</b>
                    </p>
                  </div>

                  <div className={classes.actions}>
                    {/* (opcijsko) ogled */}
                    <Link className={classes.ghostBtn} href={`/Competitions/${comp.id}`}>
                      
                    </Link>

                    {/* edit */}
                    <Link className={classes.urediBtn} href={`/Competitions/${comp.id}/edit`}>
                     
                       Uredi <Pencil size={18} />
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
