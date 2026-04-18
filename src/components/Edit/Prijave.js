"use client";

import { db } from "@/lib/firebase";
import { 
  doc, 
  collection, 
  getDocs,
  getDoc, 
  updateDoc, 
  setDoc,
  onSnapshot 
} from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo, useCallback } from "react";

import classes from "./Prijave.module.css";

// Uvoz generatorja (create), ki ima gumbe za žreb in dropdown liste
import Bracket4Generator from "@/components/Brackets/Bracket4"; 

export default function Prijave() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const router = useRouter();
  const [comp, setComp] = useState(null);

  // Stanja za žreb
  const [pripravljenNaZreb, setPripravljenNaZreb] = useState(false);
  const [tempMatches, setTempMatches] = useState([]);

  // 1. REAL-TIME pridobivanje prijav in podatkov o tekmovanju
  useEffect(() => {
    if (!id) return;

    // Poslušalec za podatke o tekmovanju
    const compRef = doc(db, "competitions", id);
    const unsubComp = onSnapshot(compRef, (snap) => {
      if (snap.exists()) {
        setComp({ id: snap.id, ...snap.data() });
      }
    });

    // Poslušalec za prijave (da takoj vidiš nove prijave)
    const appsRef = collection(db, "competitions", id, "applications");
    const unsubApps = onSnapshot(appsRef, (snap) => {
      setApplications(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      unsubComp();
      unsubApps();
    };
  }, [id]);

  // 2. Funkcija za potrjevanje ali zavračanje ekip
  async function spremeniStatus(prijavaId, noviStatus) {
    try {
      const idRef = doc(db, "competitions", id, "applications", prijavaId);
      await updateDoc(idRef, { status: noviStatus });
      // UI se bo samodejno posodobil zaradi onSnapshot
    } catch (err) {
      console.error("Napaka pri posodabljanju statusa:", err);
    }
  }

  // 3. OPTIMIZACIJA: Priprava ekip za Bracket
  const teamsForBracket = useMemo(() => {
    return applications
      .filter(a => a.status === 'potrjeno')
      .map(e => ({ id: e.id, name: e.teamName }));
  }, [applications]);

  const handleMatchesChange = useCallback((newMatches) => {
    setTempMatches(newMatches);
  }, []);

  // 4. KONČNA OBJAVA ŽREBA
  async function objaviZreb() {
    const imaEkipe = tempMatches.some(m => (m.home && m.home !== "") || (m.away && m.away !== ""));
    if (!imaEkipe) return alert("Najprej v Bracketu klikni gumb 'Naključni žreb'!");

    try {
      // A) SHRANIMO EKIPE V /teams (za viewer 'teamCount')
      for (const ekipa of teamsForBracket) {
        await setDoc(doc(db, "competitions", id, "teams", ekipa.id), {
          name: ekipa.name
        });
      }

      // B) SHRANIMO TEKME V /matches
      for (const m of tempMatches) {
        await setDoc(doc(db, "competitions", id, "matches", m.id), {
          ...m,
          scoreHome: null,
          scoreAway: null,
          completed: false
        });
      }

      // C) PREKLOP NA SCHEDULE MODE
      const compRef = doc(db, "competitions", id);
      await updateDoc(compRef, { 
        publishMode: "SCHEDULE", // Usklajeno z CompetitionDetails
        status: "v_teku"
      });

      alert("Žreb je uspešno objavljen! Gledalci zdaj vidijo razpored.");
      setPripravljenNaZreb(false);
      // Preusmerimo na javni pogled, da admin vidi rezultat
      router.push(`/Competitions/${id}`); 
    } catch (err) {
      console.error("Napaka pri objavi žreba:", err);
      alert("Prišlo je do napake pri shranjevanju.");
    }
  }

  if (loading) return <div className={classes.wrapper}>Nalagam prijave...</div>;

  const potrjeneEkipe = applications.filter(a => a.status === 'potrjeno');
  const novePrijave = applications.filter(a => !a.status || (a.status !== 'potrjeno' && a.status !== 'zavrnjeno'));
  const zavrnjeneEkipe = applications.filter(a => a.status === 'zavrnjeno');
  
  const maxMest = comp?.maxTeams || 0;
  const trenutnoPrijavljenih = applications.length;
  const isFull = maxMest > 0 && potrjeneEkipe.length >= maxMest;
  const prostaMesta = Math.max(0, maxMest - potrjeneEkipe.length);

  return (
    <div className={classes.wrapper}>
      
      {!pripravljenNaZreb ? (
        /* --- 1. DEL: UPRAVLJANJE PRIJAV --- */
        <>
          <div className={classes.headerRow}>
            <h3 className={classes.title}>Upravljanje prijav</h3>
            <span className={classes.modeBadge}>Trenutni način: {comp?.publishMode || "FORM"}</span>
          </div>

          <div className={classes.statusBox}>
            <div className={classes.statItem}>
              <span>Največ ekip:</span>
              <strong>{maxMest}</strong>
            </div>
            <div className={classes.statItem}>
              <span>Potrjenih:</span>
              <strong style={{ color: isFull ? "#4caf50" : "white" }}>{potrjeneEkipe.length}</strong>
            </div>
            {maxMest > 0 && (
               <div className={classes.statItem}>
               <span>Še potrebnih:</span>
               <strong>{prostaMesta}</strong>
             </div>
            )}
          </div>

          <section className={classes.section}>
            <h4>Nove prijave ({novePrijave.length})</h4>
            {novePrijave.length === 0 && <p className={classes.empty}>Ni novih prijav.</p>}
            {novePrijave.map(app => (
              <div className={classes.row} key={app.id}>
                <div className={classes.teamInfo}>
                  <span className={classes.teamName}>{app.teamName}</span>
                  <small className={classes.userName}>{app.userName || "Neznan uporabnik"}</small>
                </div>
                <div className={classes.btnGroup}>
                  <button onClick={() => spremeniStatus(app.id, "potrjeno")} className={classes.btnConfirm}>Potrdi</button>
                  <button onClick={() => spremeniStatus(app.id, "zavrnjeno")} className={classes.btnReject}>Zavrni</button>
                </div>
              </div>
            ))}
          </section>

          <section className={classes.section}>
            <h4>Potrjene ekipe ({potrjeneEkipe.length})</h4>
            {potrjeneEkipe.map(app => (
              <div className={classes.row} key={app.id}>
                <span>{app.teamName}</span>
                <button onClick={() => spremeniStatus(app.id, "zavrnjeno")} className={classes.btnReject}>Prekliči</button>
              </div>
            ))}
          </section>

          {zavrnjeneEkipe.length > 0 && (
            <section className={classes.section}>
              <h4 style={{color: "#888"}}>Zavrnjene</h4>
              {zavrnjeneEkipe.map(app => (
                <div className={classes.row} key={app.id}>
                  <span style={{color: '#666', textDecoration: 'line-through'}}>{app.teamName}</span>
                  <button onClick={() => spremeniStatus(app.id, "potrjeno")} className={classes.btnConfirm}>Vrni</button>
                </div>
              ))}
            </section>
          )}

          <div className={classes.footerActions}>
            <button 
              className={classes.mainBtn} 
              disabled={potrjeneEkipe.length < 2} // Vsaj 2 ekipi za karkoli
              onClick={() => setPripravljenNaZreb(true)}
            >
              Nadaljuj na žreb ({potrjeneEkipe.length} ekip)
            </button>
            <p className={classes.hint}>
              * Ko objaviš žreb, se prijave samodejno zaprejo za javnost.
            </p>
          </div>
        </>
      ) : (
        /* --- 2. DEL: GENERIRANJE ŽREBA --- */
        <div className={classes.zrebWrapper}>
          <div className={classes.zrebHeader}>
            <h3>Generator žreba</h3>
            <button onClick={() => setPripravljenNaZreb(false)} className={classes.btnBack}>
              Nazaj na prijave
            </button>
          </div>

          <div className={classes.bracketBox}>
            <Bracket4Generator 
              teams={teamsForBracket} 
              onChangeMatches={handleMatchesChange} 
            />
          </div>

          <div className={classes.footerPublish}>
            <button onClick={objaviZreb} className={classes.btnPublish}>
              KONČAJ ŽREB IN OBJAVI NA STRAN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}