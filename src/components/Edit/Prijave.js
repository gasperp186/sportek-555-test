"use client";

import { db } from "@/lib/firebase";
import { 
  doc, 
  collection, 
  updateDoc, 
  setDoc,
  onSnapshot 
} from "firebase/firestore";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect, useMemo, useCallback } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

import classes from "./Prijave.module.css";

import Bracket4Generator from "@/components/Brackets/Bracket4"; 
import Bracket8Generator from "@/components/Brackets/Bracket8"; 
import Bracket16Generator from "@/components/Brackets/Bracket16"; 
import LeagueDraw from "@/components/Create/LeagueDraw";

export default function Prijave() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false); // Stanje za loading spinner ob objavi
  const [error, setError] = useState(null); // Stanje za rdeč napis
  const { id } = useParams();
  const router = useRouter();
  const [comp, setComp] = useState(null);

  const [pripravljenNaZreb, setPripravljenNaZreb] = useState(false);
  const [tempMatches, setTempMatches] = useState([]);

  useEffect(() => {
    if (!id) return;

    const compRef = doc(db, "competitions", id);
    const unsubComp = onSnapshot(compRef, (snap) => {
      if (snap.exists()) {
        setComp({ id: snap.id, ...snap.data() });
      }
    });

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

  async function spremeniStatus(prijavaId, noviStatus) {
    try {
      const idRef = doc(db, "competitions", id, "applications", prijavaId);
      await updateDoc(idRef, { status: noviStatus });
    } catch (err) {
      console.error("Napaka pri posodabljanju statusa:", err);
    }
  }

  const teamsForBracket = useMemo(() => {
    return applications
      .filter(a => a.status === 'potrjeno')
      .map(e => ({ id: e.id, name: e.teamName }));
  }, [applications]);

  const handleMatchesChange = useCallback((newMatches) => {
    setTempMatches(newMatches);
    setError(null); // Počistimo napako ob spremembi žreba
  }, []);

  async function objaviZreb() {
    if (isSaving) return;

    const imaEkipe = tempMatches.some(m => (m.home && m.home !== "") || (m.away && m.away !== ""));
    if (!imaEkipe) {
      setError("Najprej generirajte žreb!");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // 1. Shranimo ekipe
      for (const ekipa of teamsForBracket) {
        await setDoc(doc(db, "competitions", id, "teams", ekipa.id), {
          name: ekipa.name
        });
      }

      // 2. Shranimo generirane tekme (OČIŠČENE FAZE, DA DELUJE LESTVICA)
      for (const m of tempMatches) {
        // Ustvarimo kopijo tekme in ji odstranimo phase, če obstaja
        const ociscenaTekma = { ...m };
        if (ociscenaTekma.phase) {
          delete ociscenaTekma.phase; 
        }

        await setDoc(doc(db, "competitions", id, "matches", m.id), {
          ...ociscenaTekma,
          scoreHome: null,
          scoreAway: null,
          completed: false
        });
      }

      // 3. Posodobimo status turnirja
      const compRef = doc(db, "competitions", id);
      await updateDoc(compRef, { 
        publishMode: "SCHEDULE_ONLY",
        status: "v_teku"
      });

      setIsSaving(false);
      setPripravljenNaZreb(false);
      router.push(`/Competitions/${id}`); 
    } catch (err) {
      console.error("Napaka pri objavi žreba:", err);
      setError("Prišlo je do napake pri shranjevanju žreba.");
      setIsSaving(false);
    }
  }

  // Če se nalaga prvič ali če se žreb shranjuje, pokažemo spinner čez cel ekran
  if (loading || isSaving) return <LoadingSpinner />;

  const potrjeneEkipe = applications.filter(a => a.status === 'potrjeno');
  const novePrijave = applications.filter(a => !a.status || (a.status !== 'potrjeno' && a.status !== 'zavrnjeno'));
  const zavrnjeneEkipe = applications.filter(a => a.status === 'zavrnjeno');
  
  const maxMest = comp?.maxTeams || 0;
  const isFull = maxMest > 0 && potrjeneEkipe.length >= maxMest;
  const prostaMesta = Math.max(0, maxMest - potrjeneEkipe.length);

  return (
    <div className={classes.wrapper}>
      
      {!pripravljenNaZreb ? (
        <>
          <h2 className={classes.title}>Upravljanje prijav</h2>

          <div className={classes.statusBox}>
            <div className={classes.statItem}>
              <span>Največje število ekip: <p className={classes.stevilka}>{maxMest}</p></span>
              
            </div>
            {/* <div className={classes.statItem}>
              <span>Potrjenih:</span>
              <strong style={{ color: isFull ? "#4caf50" : "white" }}>{potrjeneEkipe.length}</strong>
            </div>
            {maxMest > 0 && (
              <div className={classes.statItem}>
                <span>Še potrebnih:</span>
                <strong>{prostaMesta}</strong>
              </div>
            )} */}
          </div>

          <section className={classes.section}>
            <h4>Nove prijave ({novePrijave.length})</h4>
            {novePrijave.length === 0}
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
              <h4 style={{color: "black"}}>Zavrnjene</h4>
              {zavrnjeneEkipe.map(app => (
                <div className={classes.row} key={app.id}>
                  <span style={{color: 'black', textDecoration: 'line-through'}}>{app.teamName}</span>
                  <button onClick={() => spremeniStatus(app.id, "potrjeno")} className={classes.btnConfirm}>Vrni</button>
                </div>
              ))}
            </section>
          )}

          <div className={classes.footerActions}>
            <button 
              className={classes.mainBtn} 
              disabled={potrjeneEkipe.length < 2}
              onClick={() => setPripravljenNaZreb(true)}
            >
              Nadaljuj na žreb
            </button>
          </div>
        </>
      ) : (
        <div className={classes.zrebWrapper}>
          <div className={classes.zrebHeader}>
            <h3>Generator žreba</h3>
            <button onClick={() => setPripravljenNaZreb(false)} className={classes.btnBack}>
              Nazaj na prijave
            </button>
          </div>

          {/* KNOCKOUT */}
          {comp?.mode === "knockout" && (
            <>
              {maxMest === 4 && (
                <div className={classes.bracketBox}>
                  <Bracket4Generator 
                    teams={teamsForBracket} 
                    onChangeMatches={handleMatchesChange} 
                    isHybrid={false}
                    thirdPlaceMatch={comp.thirdPlaceMatch}
                  />
                </div>
              )}
              {maxMest === 8 && (
                <div className={classes.bracketBox}>
                  <Bracket8Generator 
                    teams={teamsForBracket} 
                    onChangeMatches={handleMatchesChange} 
                    isHybrid={false}
                    thirdPlaceMatch={comp.thirdPlaceMatch}
                  />
                </div>
              )}
              {maxMest === 16 && (
                <div className={classes.bracketBox}>
                  <Bracket16Generator 
                    teams={teamsForBracket} 
                    onChangeMatches={handleMatchesChange} 
                    isHybrid={false}
                    thirdPlaceMatch={comp.thirdPlaceMatch}
                  />
                </div>
              )}
            </>
          )}

          {/* LIGA ALI HIBRID (za oba se v tej fazi zgenerira samo ligaški razpored) */}
          {(comp?.mode === "ligaski" || comp?.mode === "hybrid") && (
            <div className={classes.bracketBox}>
              <LeagueDraw 
  teams={teamsForBracket} 
  onChangeMatches={handleMatchesChange} 
  isHybrid={comp.mode === "hybrid"}
  thirdPlaceMatch={comp.thirdPlaceMatch} // DODAJ
/>
            </div>
          )}

          <div className={classes.footerPublish} style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
            <button onClick={objaviZreb} className={classes.btnPublish}>
             Shrani in objavi
            </button>

            {/* RDEČI NAPIS ZA NAPAKO */}
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
        </div>
      )}
    </div>
  );
}