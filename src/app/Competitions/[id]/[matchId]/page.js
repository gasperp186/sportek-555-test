"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import classes from "./MatchDetails.module.css";

import { competitions } from "@/data/Competitions";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { toPng } from 'html-to-image';
import { useRef, useCallback } from 'react';
import { Camera, Printer } from 'lucide-react';

import {
  toDateOrNull,
  toTimeDateOrNull,
  formatYMD,
  formatHM,
} from "@/lib/DateTime";


import { auth } from "@/lib/firebase"; // Uvozi svoj auth
import { db } from "@/lib/firebase";
import { collection, getDocs, doc, getDoc, updateDoc, query, where, onSnapshot } from "firebase/firestore";

export default function Page() {

  

  const [comp, setComp] = useState(null);
  const [match, setMatch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [role, setRole] = useState("");

  const { id, matchId } = useParams();

  const selectedDate = toDateOrNull(match?.date);
    const selectedTime = toTimeDateOrNull(match?.time);
  console.log("ID-ji iz URL-ja:", id, matchId);


    const router = useRouter();

    const ref = useRef(null);
    const refPlakat = useRef(null);

    const shraniPng = useCallback(() => {
  if (ref.current === null) return;

  toPng(ref.current, { 
    cacheBust: true,
    pixelRatio: 2, // <--- NUJNO za ostrejši tekst
    backgroundColor: '#b64e4e', // Tvoja rdeča barva
    style: {
      padding: '20px', // Doda malo roba, da tekst ne tolče ob rob slike
    }
  })
  .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = 'my-image-name.png'
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        console.log(err)
      })
  }, [ref]);

  const shraniPlakat = useCallback(() => {
  if (refPlakat.current === null) return;

  toPng(refPlakat.current, { 
    cacheBust: true,
    pixelRatio: 2, // <--- NUJNO za ostrejši tekst
    backgroundColor: '#b64e4e', // Tvoja rdeča barva
    style: {
      padding: '20px', // Doda malo roba, da tekst ne tolče ob rob slike
    }
  })
  .then((dataUrl) => {
        const link = document.createElement('a')
        link.download = 'my-plakat.png'
        link.href = dataUrl
        link.click()
      })
      .catch((err) => {
        console.log(err)
      })
  }, [refPlakat])

function updateMatchField(field, value) {
  setMatch((prev) => ({
    ...prev,
    [field]: value 
  }));
}




    useEffect(() => {
  async function fetchData() {
    try {
      // 1. Dobi tekmovanje
      const compRef = doc(db, "competitions", id);
      const compSnap = await getDoc(compRef);

      if (!compSnap.exists()) {
        console.error("Tekmovanje ne obstaja!");
        setLoading(false);
        return;
      }

      const compData = compSnap.data();
      setComp({ id: compSnap.id, ...compData });

      // 2. Dobi tekmo (Pazi na ime podzbirke 'matches')
      const matchRef = doc(db, "competitions", id, "matches", matchId);
      const matchSnap = await getDoc(matchRef);

      if (matchSnap.exists()) {
        setMatch({ id: matchSnap.id, ...matchSnap.data() });
      } else {
        console.error("Tekma ne obstaja v podzbirki matches!");
      }

      // 3. Varno preverjanje pravic (uporabi že uvožen 'auth')
      const currentUser = auth.currentUser;
      if (currentUser && compData) {
        const isOwner = currentUser.uid === compData.createdBy;
        const isEditor = compData.editors?.includes(currentUser.uid);

        if(isOwner) {
          setRole("owner");
        } else if(isEditor) {
          setRole("editor")

        }
        

        
      } else{
        setRole("viewer");
      }

    } catch (error) {
      console.error("Napaka pri branju baze:", error);
    } finally {
      setLoading(false);
    }
  }

  if (id && matchId) {
    fetchData();
  }
}, [id, matchId]);




const handleSave = async () => {
  try {
    const homeEl = document.getElementById("homeInput");
    const awayEl = document.getElementById("awayInput");
    const statusEl = document.getElementById("status");

    const newHomeScore = homeEl.value === "" ? null : Number(homeEl.value);
    const newAwayScore = awayEl.value === "" ? null : Number(awayEl.value);

    
    const newStatus = statusEl.value;

    if(comp.mode === "knockout" && statusEl.value === "finished" && newHomeScore === newAwayScore) {
      setError("Končni rezultat ne sme biti neodločen!");
      return;

    }

    const matchesRef = collection(db, "competitions", id, "matches");
    const currentMatchRef = doc(db, "competitions", id, "matches", matchId);

    const tipTekme = typeof match.round;
    // --- 1. LOGIKA ZA BRACKET (KNOCKOUT) ---
    if (tipTekme === "string") {
      // Določi ciljni krog
      let targetRound = null;
      switch(match.round) {
        case "R16_1": case "R16_2": targetRound = "QF1"; break;
        case "R16_3": case "R16_4": targetRound = "QF2"; break;
        case "R16_5": case "R16_6": targetRound = "QF3"; break;
        case "R16_7": case "R16_8": targetRound = "QF4"; break;
        case "QF1": case "QF2": targetRound = "SF1"; break;
        case "QF3": case "QF4": targetRound = "SF2"; break;
        case "SF1": case "SF2": targetRound = "F1"; break;
        default: targetRound = null;
      }

      if (newStatus === "finished" && match.nextPosition && targetRound) {
        const winner = newHomeScore > newAwayScore ? (match.home?.name || match.home) : (match.away?.name || match.away);
        const q = query(matchesRef, where("round", "==", targetRound));
        const snap = await getDocs(q);
        if (!snap.empty) {
          await updateDoc(snap.docs[0].ref, { [match.nextPosition]: winner });
        }
      }

      // Posebej za 3. mesto (poraženci iz SF)
      if (newStatus === "finished" && String(match.round).startsWith("SF") && match.nextPosition) {
        const loser = newHomeScore > newAwayScore ? (match.away?.name || match.away) : (match.home?.name || match.home);
        const queryT3 = query(matchesRef, where("round", "==", "T3"));
        const snapT3 = await getDocs(queryT3);
        if (!snapT3.empty) {
          await updateDoc(snapT3.docs[0].ref, { [match.nextPosition]: loser });
        }
      }
    }

    // --- 2. SKUPNO SHRANJEVANJE (LIGA IN BRACKET) ---
    // Ta del se izvede vedno, ne glede na mode
    await updateDoc(currentMatchRef, {
      homeScore: newHomeScore,
      awayScore: newAwayScore,
      status: newStatus,
      date: match.date || "",
      time: match.time || "",
      location: match.location || "",
      city: match.city || "",
      completed: newStatus === "finished" // Pomembno za ligaško lestvico
    });

    setMatch(prev => ({
      ...prev,
      homeScore: newHomeScore,
      awayScore: newAwayScore,
      status: newStatus
    }));

    alert("Shranjeno");
  } catch (error) {
    console.error("Napaka pri shranjevanju", error);
    alert("Napaka: " + error.message);
  }
};

    


    
if (loading) return <div className={classes.loading}>Nalagam podatke...</div>;
 
  

  if (!match) {
    return (
      <div className={classes.page}>
        <div className={classes.card}>
          <p className={classes.breadcrumb}>Tekmovanje {comp.title}</p>
          <h2 className={classes.title}>Tekma ni najdena</h2>
          <div className={classes.buttonDiv}>
            <Link href={`/Competitions/${comp.id}`} className={classes.nazajButton}>
              Nazaj
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.page}>
      <div className={classes.card}>
        <p className={classes.breadcrumb}>{comp.title}</p>
        <h2 className={classes.title}>{match.round}</h2>

        <div className={classes.teams}>
          {/* DOMAČI */}
          <div className={classes.team}>
            <h3>{match.home?.name || match.home || "TBD"}</h3>

            {role === "owner" || role === "editor" ? (     //ČE JE UPORABNIK ADMIN ALI EDITOR
              <input 
              id="homeInput"
                type="number" 
                className={classes.scoreInput} 
                defaultValue={match.homeScore ?? ""} 
                min="0"
              />
            ) : (
              <p className={classes.score}>{match.status === "scheduled" ?  "-" : match.homeScore ?? "-"}</p>
            )}
          </div>

          <span className={classes.vs}>VS</span>

          {/* GOSTJE */}
          <div className={classes.team}>
            <h3>{match.away?.name || match.away || "TBD"}</h3>
            {role === "owner" || role === "editor" ? (
              <input 
              id="awayInput"
                type="number" 
                className={classes.scoreInput} 
                defaultValue={match.awayScore ?? ""} 
                min="0"

              />
            ) : (
              <p className={classes.score}>{match.status === "scheduled" ? "-" : match.awayScore ?? "-"}</p>
            )}
          </div>
        </div>
        {role === "owner" || role === "editor" ? (
          <div className={classes.statusBox}>
          <select name="status" id="status" defaultValue={match.status} className={classes.status}> 
            <option value="scheduled">Načrtovana</option>
            <option value="live">V teku</option>
            <option value="finished">Končana</option>
          </select>
        </div>
        ) : (
            <div className={classes.statusBox}>
          <div className={classes.viewerStatus}>
            <p>{match.status}</p>
          </div>
        </div>
        )}
        

        {/* Ostali podatki ostanejo statični za vse */}
        <div className={classes.info}>

          {role === "owner" ? (
            <>
         
<div className={classes.infoRow}>

  <div className={classes.box}><strong style={{ paddingLeft: "6px", paddingRight: "6px" }}>Datum:</strong>
            <DatePicker
              selected={selectedDate}
           onChange={(d) => updateMatchField("date", d ? formatYMD(d) : "")}
              dateFormat="dd.MM.yyyy"
              placeholderText="Datum"
              className={classes.dpInput}
            /></div>
           

              <div className={classes.box}>
                  <strong>Ura:</strong>
                  <DatePicker
                    selected={selectedTime}
                    onChange={(d) => updateMatchField("time", d ? formatHM(d) : "")}                    
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    timeCaption="Ura"
                    dateFormat="HH:mm"
                    placeholderText="Ura"
                    className={classes.dpInput}
                  />

              </div>

</div>
              
           
          
          <div className={classes.infoRow}>
             <div className={classes.box}>
            <strong>Lokacija:</strong>
              <input  
              name="location" 
              type="text" 
              value={match.location || ""} 
              onChange={(e) => updateMatchField("location", e.target.value)} />
            </div>

            <div className={classes.box}>
              <strong>Kraj:</strong> 
              <input 
              name="city" 
              type="text" 
              value={match.city || ""} 
              onChange={(e) => updateMatchField("city", e.target.value)} />
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

  <div className={classes.prazenDiv}>

  </div>

  <div  className={classes.srednjiDiv}>

     <button  onClick={() => router.back()} className={classes.nazajButton}>
            Nazaj
          </button>

          <button onClick={handleSave} className={classes.nazajButton}>Shrani</button>
          
    
  </div>

  <div  className={classes.zadnjiDiv}>

    <button onClick={shraniPng} className={classes.screenshoot}><Camera size={18} /></button>

          <button onClick={shraniPlakat} className={classes.screenshoot}><Printer size={18} /></button>
    
  </div>

             

          

</div>



{/* --- SKRIT DIV SAMO ZA GENERIRANJE SLIKE --- */}
<div style={{ position: 'absolute', left: '-9999px', top: '0' }}>
  <div ref={ref} className={classes.socialCardExport}>

    <h1 className={classes.exportCompTitle}>{comp.title}</h1>
    <h2 className={classes.exportRound}>{match.round}</h2>

    <div className={classes.exportMatchArea}>
      <div className={classes.exportTeam}>
        <h3>{match.home?.name || match.home || "TBD"}</h3>
      </div>

      <div className={classes.exportScore}>
        {`${match.homeScore}`}
      </div>
      <div className={classes.exportScore}>
        {`${match.awayScore}`}
      </div>

      <div className={classes.exportTeam}>
        <h3>{match.away?.name || match.away || "TBD"}</h3>
      </div>
         

    </div>
 <h2 className={classes.koncniRezultat}>Končni rezultat</h2>
  </div>

  {/* SKRIT DIV ZA PLAKAT (A4 format) */}
<div style={{ position: 'absolute', left: '-9999px', top: '0', width: '800px' }}>
  <div ref={refPlakat} className={classes.plakatExport}>
    
    
      <h1 className={classes.plakatTitle}>{comp.title}</h1>
      <h1 className={classes.plakatRound}>{match.round}</h1>


      <div className={classes.plakatDate}>
<p>
  {match.date 
    ? new Date(match.date).toLocaleDateString('sl-SI') 
    : "Datum ni določen"}
</p>
      </div>
      
      <div className={classes.plakatMatchRow}>
        <span className={classes.plakatTeam}>{match.home}</span>
        <span className={classes.plakatVs}>VS</span>
        <span className={classes.plakatTeam}>{match.away}</span>
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

    
  )
}