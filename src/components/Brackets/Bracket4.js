"use client";

import { useState, useEffect } from "react";
import classes from "./Bracket4.module.css";
import MatchCard from "./MatchCard";

export default function Bracket4({ teams, matches, onChangeMatches, isHybrid, thirdPlaceMatch }) {
  // Inicializacija stanja: preveri, če matches že obstajajo v staršu (form.matches)
  const [matchData, setMatchData] = useState(() => {
    const initialState = {
      SF1: { home: "", away: "", date: "", time: "" },
      SF2: { home: "", away: "", date: "", time: "" },
      F1:  { date: "", time: "" },
      T3:  { date: "", time: "" },
    };

    // Če smo se vrnili "Nazaj", napolni lokalno stanje iz prejetih podatkov
    if (matches && matches.length > 0) {
      matches.forEach(m => {
        if (initialState[m.id]) {
          initialState[m.id] = {
            home: m.home || "",
            away: m.away || "",
            date: m.date || "",
            time: m.time || ""
          };
        }
      });
    }
    return initialState;
  });

  function setWhen(round, field, value) {
    setMatchData(prev => ({
      ...prev,
      [round]: { ...prev[round], [field]: value }
    }));
  }

  function setTeam(round, side, value) {
    setMatchData(prev => ({
      ...prev,
      [round]: { ...prev[round], [side]: value }
    }));
  }

  function nakljucniZreb() {
    const premesaneEkipe = Razmesi(teams);
    setMatchData(prev => ({
      ...prev,
      SF1: { ...prev.SF1, home: premesaneEkipe[0]?.name ?? "", away: premesaneEkipe[1]?.name ?? "" },
      SF2: { ...prev.SF2, home: premesaneEkipe[2]?.name ?? "", away: premesaneEkipe[3]?.name ?? "" },
    }));
  }

  function ponastaviZreb() {
    setMatchData(prev => ({
      ...prev,
      SF1: { ...prev.SF1, home: "", away: "" },
      SF2: { ...prev.SF2, home: "", away: "" },
    }));
  }

  function Razmesi(list) {
    const copy = [...list];
    for(let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // Logika za proste ekipe (da ne izbereš iste ekipe dvakrat)
  const freeSf1Home = teams.filter(t => ![matchData.SF1.away, matchData.SF2.home, matchData.SF2.away].includes(t.name));
  const freeSf1Away = teams.filter(t => ![matchData.SF1.home, matchData.SF2.home, matchData.SF2.away].includes(t.name));
  const freeSf2Home = teams.filter(t => ![matchData.SF1.away, matchData.SF1.home, matchData.SF2.away].includes(t.name));
  const freeSf2Away = teams.filter(t => ![matchData.SF1.away, matchData.SF2.home, matchData.SF1.home].includes(t.name));

  useEffect(() => {
  if (!onChangeMatches) return;

  // Ustvarimo seznam tekem
  const matchesToSave = [
    { 
      id: "SF1", round: "SF1", phase: "knockout",
      home: isHybrid ? "1. uvrščeni" : matchData.SF1.home, 
      away: isHybrid ? "4. uvrščeni" : matchData.SF1.away, 
      date: matchData.SF1.date, time: matchData.SF1.time, nextPosition: "home" 
    },
    { 
      id: "SF2", round: "SF2", phase: "knockout",
      home: isHybrid ? "2. uvrščeni" : matchData.SF2.home, 
      away: isHybrid ? "3. uvrščeni" : matchData.SF2.away, 
      date: matchData.SF2.date, time: matchData.SF2.time, nextPosition: "away" 
    },
    { 
      id: "F1", round: "F1", phase: "knockout", home: "", away: "", 
      date: matchData.F1.date, time: matchData.F1.time 
    },
    // Tekmo za 3. mesto dodamo samo, če je thirdPlaceMatch resničen
    thirdPlaceMatch ? { 
      id: "T3", round: "T3", phase: "knockout", home: "", away: "", 
      date: matchData.T3.date, time: matchData.T3.time 
    } : null,
  ].filter(Boolean); // To odstrani 'null' iz seznama, če thirdPlaceMatch ni označen

  onChangeMatches(matchesToSave);
}, [matchData, isHybrid, onChangeMatches, thirdPlaceMatch]);

  const matchConfigs = [
    { id: "SF1", label: "Polfinale 1", h: "1. uvrščeni", a: "4. uvrščeni", home: matchData.SF1.home, away: matchData.SF1.away, setH: (val) => setTeam("SF1", "home", val), setA: (val) => setTeam("SF1", "away", val), fH: freeSf1Home, fA: freeSf1Away },
    { id: "SF2", label: "Polfinale 2", h: "2. uvrščeni", a: "3. uvrščeni", home: matchData.SF2.home, away: matchData.SF2.away, setH: (val) => setTeam("SF2", "home", val), setA: (val) => setTeam("SF2", "away", val), fH: freeSf2Home, fA: freeSf2Away },
    { id: "F1",  label: "Finale",      h: "Finalist 1",   a: "Finalist 2",   home: "",                   away: "",                   setH: () => {},   setA: () => {},   fH: [],           fA: [] },
    { id: "T3",  label: "Za 3. mesto", h: "Ekipa 1",      a: "Ekipa 2",      home: "",                   away: "",                   setH: () => {},   setA: () => {},   fH: [],           fA: [] },
  ];

  return (
  <div>
    {!isHybrid && (
      <div className={classes.btnRow}>
        <button type="button" onClick={nakljucniZreb} className={classes.secondaryBtn}>Naključen žreb</button>
        <button type="button" onClick={ponastaviZreb} className={classes.secondaryBtn}>Ponastavi žreb</button>
      </div>
    )}

    {matchConfigs
      .filter(m => m.id !== "T3" || thirdPlaceMatch) // Pokaži vse razen T3, če je thirdPlaceMatch false
      .map((m) => (
        <MatchCard
          key={m.id}
          match={{ id: m.id, label: m.label, date: matchData[m.id].date, time: matchData[m.id].time }}
          setWhen={setWhen}
          homeValue={isHybrid || m.id === "F1" || m.id === "T3" ? m.h : m.home}
          awayValue={isHybrid || m.id === "F1" || m.id === "T3" ? m.a : m.away}
          setHome={m.setH}
          setAway={m.setA}
          freeHome={m.fH}
          freeAway={m.fA}
          isHybrid={isHybrid}
        />
      ))}
  </div>
);
}