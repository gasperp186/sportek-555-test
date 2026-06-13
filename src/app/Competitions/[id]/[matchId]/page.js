"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import classes from "./MatchDetails.module.css";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { toPng } from 'html-to-image';
import { Camera, Printer } from 'lucide-react';


import {
  toDateOrNull,
  toTimeDateOrNull,
  formatYMD,
  formatHM,
} from "@/lib/DateTime";

import { auth, db } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  query, 
  where 
} from "firebase/firestore";

export default function Page() {
  const [comp, setComp] = useState(null);
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [role, setRole] = useState("");

  const { id, matchId } = useParams();
  const router = useRouter();

  const ref = useRef(null);
  const refPlakat = useRef(null);

  const selectedDate = toDateOrNull(match?.date);
  const selectedTime = toTimeDateOrNull(match?.time);

  // --- LOGIKA ZA PRIKAZ IMENA KROGA (NAPIS) ---
  const izpisanNapis = useMemo(() => {
    if (!match?.round) return "Podrobnosti tekme";

    if (typeof match.round === "number") {
      return `${match.round}. krog`;
    }

    const roundMapping = {
      "R16_1": "Osmina finala", "R16_2": "Osmina finala", "R16_3": "Osmina finala", "R16_4": "Osmina finala",
      "R16_5": "Osmina finala", "R16_6": "Osmina finala", "R16_7": "Osmina finala", "R16_8": "Osmina finala",
      "QF1": "Četrtfinale", "QF2": "Četrtfinale", "QF3": "Četrtfinale", "QF4": "Četrtfinale",
      "SF1": "Polfinale", "SF2": "Polfinale",
      "T3": "Tekma za 3. mesto",
      "F1": "Finale"
    };

    return roundMapping[match.round] || `Krog ${match.round}`;
  }, [match?.round]);

  // --- PRIDOBIVANJE PODATKOV ---
  useEffect(() => {
    async function fetchData() {
      if (!id || !matchId) return;
      try {
        const compRef = doc(db, "competitions", id);
        const compSnap = await getDoc(compRef);

        if (!compSnap.exists()) {
          setLoading(false);
          return;
        }

        const compData = compSnap.data();
        setComp({ id: compSnap.id, ...compData });

        const matchRef = doc(db, "competitions", id, "matches", matchId);
        const matchSnap = await getDoc(matchRef);

        if (matchSnap.exists()) {
          setMatch({ id: matchSnap.id, ...matchSnap.data() });
        }

        const currentUser = auth.currentUser;
        if (currentUser && compData) {
          const isOwner = currentUser.uid === compData.createdBy;
          const isEditor = compData.editors?.includes(currentUser.uid);

          if (isOwner) setRole("owner");
          else if (isEditor) setRole("editor");
          else setRole("viewer");
        } else {
          setRole("viewer");
        }
      } catch (error) {
        console.error("Napaka pri branju baze:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id, matchId]);

  // --- FUNKCIJE ZA SHRANJEVANJE IN SLIKE ---
  const shraniPng = useCallback(() => {
    if (ref.current === null) return;
    toPng(ref.current, { 
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: '#b64e4e',
      style: { padding: '20px' }
    })
    .then((dataUrl) => {
      const link = document.createElement('a');
      link.download = 'rezultat.png';
      link.href = dataUrl;
      link.click();
    });
  }, [ref]);

  const shraniPlakat = useCallback(() => {
    if (refPlakat.current === null) return;
    toPng(refPlakat.current, { 
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: '#b64e4e',
      style: { padding: '20px' }
    })
    .then((dataUrl) => {
      const link = document.createElement('a');
      link.download = 'plakat.png';
      link.href = dataUrl;
      link.click();
    });
  }, [refPlakat]);

  function updateMatchField(field, value) {
    setMatch((prev) => ({ ...prev, [field]: value }));
  }

  const handleSave = async () => {
    try {
      const homeEl = document.getElementById("homeInput");
      const awayEl = document.getElementById("awayInput");
      const statusEl = document.getElementById("status");

      const newHomeScore = homeEl.value === "" ? null : Number(homeEl.value);
      const newAwayScore = awayEl.value === "" ? null : Number(awayEl.value);
      const newStatus = statusEl.value;

      if (comp.mode === "knockout" && newStatus === "Končana" && newHomeScore === newAwayScore) {
        setError("Končni rezultat ne sme biti neodločen!");
        return;
      }

      const matchesRef = collection(db, "competitions", id, "matches");
      const currentMatchRef = doc(db, "competitions", id, "matches", matchId);

      if (typeof match.round === "string") {
        let targetRound = null;
        
        switch(match.round) {
          case "R16_1": case "R16_2": targetRound = "QF1"; break;
          case "R16_3": case "R16_4": targetRound = "QF2"; break;
          case "R16_5": case "R16_6": targetRound = "QF3"; break;
          case "R16_7": case "R16_8": targetRound = "QF4"; break;
          case "QF1": case "QF2": targetRound = "SF1"; break;
          case "QF3": case "QF4": targetRound = "SF2"; break;
          case "SF1": case "SF2": targetRound = "F1"; break;
        }

        if (newStatus === "Končana" && match.nextPosition && targetRound) {
          const winner = newHomeScore > newAwayScore ? (match.home?.name || match.home) : (match.away?.name || match.away);
          const q = query(matchesRef, where("round", "==", targetRound));
          const snap = await getDocs(q);
          if (!snap.empty) {
            await updateDoc(snap.docs[0].ref, { [match.nextPosition]: winner });
          }
        }

        if (newStatus === "Končana" && String(match.round).startsWith("SF") && match.nextPosition) {
          const loser = newHomeScore > newAwayScore ? (match.away?.name || match.away) : (match.home?.name || match.home);
          const queryT3 = query(matchesRef, where("round", "==", "T3"));
          const snapT3 = await getDocs(queryT3);
          if (!snapT3.empty) {
            await updateDoc(snapT3.docs[0].ref, { [match.nextPosition]: loser });
          }
        }
      }

      await updateDoc(currentMatchRef, {
        homeScore: newHomeScore,
        awayScore: newAwayScore,
        status: newStatus,
        date: match.date || "",
        time: match.time || "",
        location: match.location || "",
        city: match.city || "",
        completed: newStatus === "Končana"
      });

      setMatch(prev => ({ ...prev, homeScore: newHomeScore, awayScore: newAwayScore, status: newStatus }));
      alert("Shranjeno");
    } catch (err) {
      alert("Napaka pri shranjevanju");
    }
  };


  if (!match) return <div className={classes.page}>Tekma ni najdena.</div>;

  return (
    <div className={classes.page}>
      <div className={classes.card}>
        <p className={classes.breadcrumb}>{comp?.title}</p>
        <h2 className={classes.title}>{izpisanNapis}</h2>

        <div className={classes.teams}>
          <div className={classes.team}>
            <h3>{match.home?.name || match.home || "TBD"}</h3>
            {role === "owner" || role === "editor" ? (
              <input id="homeInput" type="number" className={classes.scoreInput} defaultValue={match.homeScore ?? ""} min="0" />
            ) : (
              <p className={classes.score}>{match.status === "Načrtovana" ? "-" : match.homeScore ?? "-"}</p>
            )}
          </div>

          <span className={classes.vs}>VS</span>

          <div className={classes.team}>
            <h3>{match.away?.name || match.away || "TBD"}</h3>
            {role === "owner" || role === "editor" ? (
              <input id="awayInput" type="number" className={classes.scoreInput} defaultValue={match.awayScore ?? ""} min="0" />
            ) : (
              <p className={classes.score}>{match.status === "Načrtovana" ? "-" : match.awayScore ?? "-"}</p>
            )}
          </div>
        </div>

        <div className={classes.statusBox}>
          {role === "owner" || role === "editor" ? (
            <select id="status" defaultValue={match.status} className={classes.status}>
              <option value="Načrtovana">Načrtovana</option>
              <option value="V teku">V teku</option>
              <option value="Končana">Končana</option>
            </select>
          ) : (
            <div className={classes.viewerStatus}><p>{match.status}</p></div>
          )}
        </div>

        <div className={classes.info}>
          {role === "owner" ? (
            <>
              <div className={classes.infoRow}>
                <div className={classes.box}>
                  <strong>Datum:</strong>
                  <DatePicker selected={selectedDate} onChange={(d) => updateMatchField("date", d ? formatYMD(d) : "")} dateFormat="dd.MM.yyyy" className={classes.dpInput} />
                </div>
                <div className={classes.box}>
                  <strong>Ura:</strong>
                  <DatePicker selected={selectedTime} onChange={(d) => updateMatchField("time", d ? formatHM(d) : "")} showTimeSelect showTimeSelectOnly timeIntervals={15} dateFormat="HH:mm" className={classes.dpInput} />
                </div>
              </div>
              <div className={classes.infoRow}>
                <div className={classes.box}>
                  <strong>Lokacija:</strong>
                  <input type="text" value={match.location || ""} onChange={(e) => updateMatchField("location", e.target.value)} />
                </div>
                <div className={classes.box}>
                  <strong>Kraj:</strong>
                  <input type="text" value={match.city || ""} onChange={(e) => updateMatchField("city", e.target.value)} />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className={classes.infoRow}>
                <p><strong>Datum:</strong> {match.date || "Ni določen"}</p>
                <p><strong>Čas:</strong> {match.time || "Ni določen"}</p>
              </div>
              <div className={classes.infoRow}>
                <p><strong>Kraj:</strong> {match.city || "Ni določen"}</p>
                <p><strong>Lokacija:</strong> {match.location || "Ni določen"}</p>
              </div>
            </>
          )}
          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        </div>

        <div className={classes.buttonDiv}>
          <div className={classes.prazenDiv}></div>
          <div className={classes.srednjiDiv}>
            <button onClick={() => router.back()} className={classes.nazajButton}>Nazaj</button>
            <button onClick={handleSave} className={classes.nazajButton}>Shrani</button>
          </div>
          <div className={classes.zadnjiDiv}>
            <button onClick={shraniPng} className={classes.screenshoot}><Camera size={18} /></button>
            <button onClick={shraniPlakat} className={classes.screenshoot}><Printer size={18} /></button>
          </div>
        </div>

        {/* --- SKRITI ELEMENTI ZA EXPORT --- */}
        <div style={{ position: 'absolute', left: '-9999px', top: '0' }}>
          <div ref={ref} className={classes.socialCardExport}>
            <h1 className={classes.exportCompTitle}>{comp?.title}</h1>
            <h2 className={classes.exportRound}>{izpisanNapis}</h2>
            <div className={classes.exportMatchArea}>
              <div className={classes.exportTeam}><h3>{match.home?.name || match.home}</h3></div>
              <div className={classes.exportScore}>{match.homeScore ?? 0}</div>
              <div className={classes.exportScore}>{match.awayScore ?? 0}</div>
              <div className={classes.exportTeam}><h3>{match.away?.name || match.away}</h3></div>
            </div>
            
          </div>

          <div style={{ width: '800px' }}>
            <div ref={refPlakat} className={classes.plakatExport}>
              <h1 className={classes.plakatTitle}>{comp?.title}</h1>
              <h1 className={classes.plakatRound}>{izpisanNapis}</h1>
              <div className={classes.plakatDate}>
                <p>{match.date ? new Date(match.date).toLocaleDateString('sl-SI') : "Datum ni določen"}</p>
              </div>
              <div className={classes.plakatMatchRow}>
                <span className={classes.plakatTeam}>{match.home?.name || match.home}</span>
                <span className={classes.plakatVs}>VS</span>
                <span className={classes.plakatTeam}>{match.away?.name || match.away}</span>
              </div>
              <div className={classes.plakatDetails}>
                <p className={classes.textTime}>{match.time || "Ura ni določena"}</p>
              </div>
              <div className={classes.plakatDetails}>
                <p className={classes.textDetails}>{match.location}</p>
                <p className={classes.textDetails}>{match.city}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}