"use client";

import { useState, useEffect } from "react";
import classes from "./Bracket4.module.css";
import MatchCard from "./MatchCard";

export default function Bracket16({ teams, matches, onChangeMatches, isHybrid, thirdPlaceMatch }) {
  // 1. Inicializacija stanja za vseh 16 tekem
  const [matchData, setMatchData] = useState(() => {
    const initialState = {
      R16_1: { home: "", away: "", date: "", time: "", status: "scheduled" },
      R16_2: { home: "", away: "", date: "", time: "", status: "scheduled" },
      R16_3: { home: "", away: "", date: "", time: "", status: "scheduled" },
      R16_4: { home: "", away: "", date: "", time: "", status: "scheduled" },
      R16_5: { home: "", away: "", date: "", time: "", status: "scheduled" },
      R16_6: { home: "", away: "", date: "", time: "", status: "scheduled" },
      R16_7: { home: "", away: "", date: "", time: "", status: "scheduled" },
      R16_8: { home: "", away: "", date: "", time: "", status: "scheduled" },
      QF1: { date: "", time: "" },
      QF2: { date: "", time: "" },
      QF3: { date: "", time: "" },
      QF4: { date: "", time: "" },
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
      R16_1: { ...prev.R16_1, home: p[0]?.name ?? "", away: p[1]?.name ?? "" },
      R16_2: { ...prev.R16_2, home: p[2]?.name ?? "", away: p[3]?.name ?? "" },
      R16_3: { ...prev.R16_3, home: p[4]?.name ?? "", away: p[5]?.name ?? "" },
      R16_4: { ...prev.R16_4, home: p[6]?.name ?? "", away: p[7]?.name ?? "" },
      R16_5: { ...prev.R16_5, home: p[8]?.name ?? "", away: p[9]?.name ?? "" },
      R16_6: { ...prev.R16_6, home: p[10]?.name ?? "", away: p[11]?.name ?? "" },
      R16_7: { ...prev.R16_7, home: p[12]?.name ?? "", away: p[13]?.name ?? "" },
      R16_8: { ...prev.R16_8, home: p[14]?.name ?? "", away: p[15]?.name ?? "" },
    }));
  }

  function ponastaviZreb() {
    const resetKeys = ["R16_1", "R16_2", "R16_3", "R16_4", "R16_5", "R16_6", "R16_7", "R16_8"];
    setMatchData((prev) => {
      const newState = { ...prev };
      resetKeys.forEach(key => {
        newState[key] = { ...newState[key], home: "", away: "" };
      });
      return newState;
    });
  }

  function Razmesi(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  const getFreeTeams = (currentValue) => {
    const picked = [
      matchData.R16_1.home, matchData.R16_1.away, matchData.R16_2.home, matchData.R16_2.away,
      matchData.R16_3.home, matchData.R16_3.away, matchData.R16_4.home, matchData.R16_4.away,
      matchData.R16_5.home, matchData.R16_5.away, matchData.R16_6.home, matchData.R16_6.away,
      matchData.R16_7.home, matchData.R16_7.away, matchData.R16_8.home, matchData.R16_8.away,
    ].filter(n => n !== "");
    return teams.filter(t => !picked.includes(t.name) || t.name === currentValue);
  };

  useEffect(() => {
    if (!onChangeMatches) return;

    const matchesArray = [
      ...["R16_1", "R16_2", "R16_3", "R16_4", "R16_5", "R16_6", "R16_7", "R16_8"].map((id) => ({
        id, round: id, phase: "knockout", 
        home: matchData[id].home, away: matchData[id].away, 
        date: matchData[id].date, time: matchData[id].time, 
        nextPosition: (parseInt(id.split("_")[1]) % 2 !== 0) ? "home" : "away"
      })),
      { id: "QF1", round: "QF1", phase: "knockout", home: "", away: "", date: matchData.QF1.date, time: matchData.QF1.time, nextPosition: "home", status: "scheduled" },
      { id: "QF2", round: "QF2", phase: "knockout", home: "", away: "", date: matchData.QF2.date, time: matchData.QF2.time, nextPosition: "away", status: "scheduled" },
      { id: "QF3", round: "QF3", phase: "knockout", home: "", away: "", date: matchData.QF3.date, time: matchData.QF3.time, nextPosition: "home", status: "scheduled" },
      { id: "QF4", round: "QF4", phase: "knockout", home: "", away: "", date: matchData.QF4.date, time: matchData.QF4.time, nextPosition: "away", status: "scheduled" },
      { id: "SF1", round: "SF1", phase: "knockout", home: "", away: "", date: matchData.SF1.date, time: matchData.SF1.time, nextPosition: "home", status: "scheduled" },
      { id: "SF2", round: "SF2", phase: "knockout", home: "", away: "", date: matchData.SF2.date, time: matchData.SF2.time, nextPosition: "away", status: "scheduled" },
      { id: "F1",  round: "F1",  phase: "knockout", home: "", away: "", date: matchData.F1.date,  time: matchData.F1.time, status: "scheduled" },
      thirdPlaceMatch ? { 
        id: "T3", round: "T3", phase: "knockout", home: "", away: "", 
        date: matchData.T3.date, time: matchData.T3.time, status: "scheduled" 
      } : null,
    ].filter(Boolean);

    onChangeMatches(matchesArray);
  }, [matchData, onChangeMatches, thirdPlaceMatch]);

  const matchConfigs = [
    { id: "R16_1", label: "Osmina finala 1", isManual: true },
    { id: "R16_2", label: "Osmina finala 2", isManual: true },
    { id: "R16_3", label: "Osmina finala 3", isManual: true },
    { id: "R16_4", label: "Osmina finala 4", isManual: true },
    { id: "R16_5", label: "Osmina finala 5", isManual: true },
    { id: "R16_6", label: "Osmina finala 6", isManual: true },
    { id: "R16_7", label: "Osmina finala 7", isManual: true },
    { id: "R16_8", label: "Osmina finala 8", isManual: true },
    { id: "QF1", label: "Četrtfinale 1", h: "Zmagovalec R16_1", a: "Zmagovalec R16_2" },
    { id: "QF2", label: "Četrtfinale 2", h: "Zmagovalec R16_3", a: "Zmagovalec R16_4" },
    { id: "QF3", label: "Četrtfinale 3", h: "Zmagovalec R16_5", a: "Zmagovalec R16_6" },
    { id: "QF4", label: "Četrtfinale 4", h: "Zmagovalec R16_7", a: "Zmagovalec R16_8" },
    { id: "SF1", label: "Polfinale 1",   h: "Zmagovalec QF1",   a: "Zmagovalec QF2" },
    { id: "SF2", label: "Polfinale 2",   h: "Zmagovalec QF3",   a: "Zmagovalec QF4" },
    { id: "F1",  label: "Finale",        h: "Finalist 1",       a: "Finalist 2" },
    { id: "T3",  label: "Za 3. mesto",   h: "Poraženec SF1",     a: "Poraženec SF2" },
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
            homeValue={m.isManual ? matchData[m.id].home : m.h}
            awayValue={m.isManual ? matchData[m.id].away : m.a}
            setHome={(val) => setTeam(m.id, "home", val)}
            setAway={(val) => setTeam(m.id, "away", val)}
            freeHome={m.isManual ? getFreeTeams(matchData[m.id].home) : []}
            freeAway={m.isManual ? getFreeTeams(matchData[m.id].away) : []}
            isHybrid={isHybrid || !m.isManual}
          />
        ))}
    </div>
  );
}