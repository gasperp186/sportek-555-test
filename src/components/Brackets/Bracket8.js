"use client";

import { useState, useEffect } from "react";
import classes from "./Bracket4.module.css";
import MatchCard from "./MatchCard";

export default function Bracket8({ teams, matches, onChangeMatches, isHybrid, thirdPlaceMatch }) {
  const [matchData, setMatchData] = useState(() => {
    const initialState = {
      QF1: { home: "", away: "", date: "", time: "" },
      QF2: { home: "", away: "", date: "", time: "" },
      QF3: { home: "", away: "", date: "", time: "" },
      QF4: { home: "", away: "", date: "", time: "" },
      SF1: { date: "", time: "" },
      SF2: { date: "", time: "" },
      F1:  { date: "", time: "" },
      T3:  { date: "", time: "" },
    };

    if (matches && matches.length > 0) {
      matches.forEach((m) => {
        if (initialState[m.id]) {
          initialState[m.id] = {
            home: m.home || "",
            away: m.away || "",
            date: m.date || "",
            time: m.time || "",
          };
        }
      });
    }
    return initialState;
  });

  function setWhen(round, field, value) {
    setMatchData((prev) => ({
      ...prev,
      [round]: { ...prev[round], [field]: value },
    }));
  }

  function setTeam(round, side, value) {
    setMatchData((prev) => ({
      ...prev,
      [round]: { ...prev[round], [side]: value },
    }));
  }

  function nakljucniZreb() {
    const p = Razmesi(teams);
    setMatchData((prev) => ({
      ...prev,
      QF1: { ...prev.QF1, home: p[0]?.name ?? "", away: p[1]?.name ?? "" },
      QF2: { ...prev.QF2, home: p[2]?.name ?? "", away: p[3]?.name ?? "" },
      QF3: { ...prev.QF3, home: p[4]?.name ?? "", away: p[5]?.name ?? "" },
      QF4: { ...prev.QF4, home: p[6]?.name ?? "", away: p[7]?.name ?? "" },
    }));
  }

  function ponastaviZreb() {
    setMatchData((prev) => ({
      ...prev,
      QF1: { ...prev.QF1, home: "", away: "" },
      QF2: { ...prev.QF2, home: "", away: "" },
      QF3: { ...prev.QF3, home: "", away: "" },
      QF4: { ...prev.QF4, home: "", away: "" },
    }));
  }

  function Razmesi(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  const getPickedTeams = () => {
    return [
      matchData.QF1.home, matchData.QF1.away,
      matchData.QF2.home, matchData.QF2.away,
      matchData.QF3.home, matchData.QF3.away,
      matchData.QF4.home, matchData.QF4.away,
    ].filter(name => name !== "");
  };

  const getFreeTeams = (currentValue) => {
    const allPicked = getPickedTeams();
    return teams.filter(t => !allPicked.includes(t.name) || t.name === currentValue);
  };

  useEffect(() => {
    if (!onChangeMatches) return;

    const matchesToSave = [
      { id: "QF1", round: "QF1", phase: "knockout", home: matchData.QF1.home, away: matchData.QF1.away, date: matchData.QF1.date, time: matchData.QF1.time, nextPosition: "home", status: "scheduled" },
      { id: "QF2", round: "QF2", phase: "knockout", home: matchData.QF2.home, away: matchData.QF2.away, date: matchData.QF2.date, time: matchData.QF2.time, nextPosition: "away", status: "scheduled" },
      { id: "QF3", round: "QF3", phase: "knockout", home: matchData.QF3.home, away: matchData.QF3.away, date: matchData.QF3.date, time: matchData.QF3.time, nextPosition: "home", status: "scheduled" },
      { id: "QF4", round: "QF4", phase: "knockout", home: matchData.QF4.home, away: matchData.QF4.away, date: matchData.QF4.date, time: matchData.QF4.time, nextPosition: "away", status: "scheduled" },
      { id: "SF1", round: "SF1", phase: "knockout", home: "", away: "", date: matchData.SF1.date, time: matchData.SF1.time, nextPosition: "home", status: "scheduled" },
      { id: "SF2", round: "SF2", phase: "knockout", home: "", away: "", date: matchData.SF2.date, time: matchData.SF2.time, nextPosition: "away", status: "scheduled" },
      { id: "F1",  round: "F1",  phase: "knockout", home: "", away: "", date: matchData.F1.date,  time: matchData.F1.time, status: "scheduled" },
      thirdPlaceMatch ? { 
        id: "T3", round: "T3", phase: "knockout", home: "", away: "", 
        date: matchData.T3.date, time: matchData.T3.time, status: "scheduled"
      } : null,
    ].filter(Boolean);

    onChangeMatches(matchesToSave); // <--- NUJNO DODAJ TO!
  }, [matchData, onChangeMatches, thirdPlaceMatch]);

  // Tukaj dodamo setHome, setAway in proste ekipe za QF tekme
  const matchConfigs = [
    { id: "QF1", label: "Četrtfinale 1", isManual: true, h: "Ekipa 1", a: "Ekipa 2", setH: (v) => setTeam("QF1", "home", v), setA: (v) => setTeam("QF1", "away", v) },
    { id: "QF2", label: "Četrtfinale 2", isManual: true, h: "Ekipa 3", a: "Ekipa 4", setH: (v) => setTeam("QF2", "home", v), setA: (v) => setTeam("QF2", "away", v) },
    { id: "QF3", label: "Četrtfinale 3", isManual: true, h: "Ekipa 5", a: "Ekipa 6", setH: (v) => setTeam("QF3", "home", v), setA: (v) => setTeam("QF3", "away", v) },
    { id: "QF4", label: "Četrtfinale 4", isManual: true, h: "Ekipa 7", a: "Ekipa 8", setH: (v) => setTeam("QF4", "home", v), setA: (v) => setTeam("QF4", "away", v) },
    { id: "SF1", label: "Polfinale 1",   isManual: false, h: "Zmagovalec QF1", a: "Zmagovalec QF2" },
    { id: "SF2", label: "Polfinale 2",   isManual: false, h: "Zmagovalec QF3", a: "Zmagovalec QF4" },
    { id: "F1",  label: "Finale",        isManual: false, h: "Finalist 1",     a: "Finalist 2" },
    { id: "T3",  label: "Za 3. mesto",   isManual: false, h: "Poraženec SF1",   a: "Poraženec SF2" },
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
        .filter(m => m.id !== "T3" || thirdPlaceMatch)
        .map((m) => (
          <MatchCard
            key={m.id}
            match={{ id: m.id, label: m.label, date: matchData[m.id].date, time: matchData[m.id].time }}
            setWhen={setWhen}
            // Če je hibrid ali če tekma NI ročna, vzemi placeholder (m.h), sicer vzemi izbrano ekipo
            homeValue={isHybrid || !m.isManual ? m.h : matchData[m.id].home}
            awayValue={isHybrid || !m.isManual ? m.a : matchData[m.id].away}
            setHome={m.setH || (() => {})}
            setAway={m.setA || (() => {})}
            freeHome={m.isManual ? getFreeTeams(matchData[m.id].home) : []}
            freeAway={m.isManual ? getFreeTeams(matchData[m.id].away) : []}
            isHybrid={isHybrid || !m.isManual}
          />
        ))}
    </div>
  );
}