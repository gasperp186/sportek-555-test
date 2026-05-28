"use client";

import { useMemo, useState, useEffect } from "react";
import classes from "./Draw.module.css"; 

function pripraviEkipe(teams) {
  const result = [];
  const arr = teams || [];

  for (let i = 0; i < arr.length; i++) {
    const t = arr[i];

    if (typeof t === "string") {
      result.push({ id: `t${i + 1}`, name: t });
    } else {
      result.push({
        id: t.id ? t.id : `t${i + 1}`,
        name: t.name ? t.name : `Ekipa ${i + 1}`,
      });
    }
  }

  return result;
}

function generirajKroge(teams) {
  const list = [...teams];

  const liho = list.length % 2 === 1;
  if (liho) {
    list.push({ id: "BYE", name: "BYE" });
  }

  const n = list.length;
  const rounds = [];

  const fixed = list[0];
  let rotating = list.slice(1);

  for (let r = 0; r < n - 1; r++) {
    const roundMatches = [];
    let byeTeamName = null;

    const left = [fixed];
    for (let i = 0; i < n / 2 - 1; i++) {
      left.push(rotating[i]);
    }

    const right = [];
    for (let i = n / 2 - 1; i < rotating.length; i++) {
      right.push(rotating[i]);
    }
    right.reverse();

    for (let i = 0; i < n / 2; i++) {
      const a = left[i];
      const b = right[i];

      if (a.id === "BYE") {
        byeTeamName = b.name;
        continue;
      }
      if (b.id === "BYE") {
        byeTeamName = a.name;
        continue;
      }

      const isEvenRound = r % 2 === 0;
      const home = isEvenRound ? a : b;
      const away = isEvenRound ? b : a;

      roundMatches.push({
        // Dodan unikaten id za vsako generirano tekmo, da lažje posodabljamo datum/uro
        id: `m-r${r + 1}-${i}`, 
        round: r + 1,
        homeTeamId: home.id,
        awayTeamId: away.id,
        home: home.name,
        away: away.name,
        scoreHome: null,
        scoreAway: null,
        phase: "league",
        date: "",  // <-- NOVO: Nastavimo privzeto vrednost za datum
        time: ""   // <-- NOVO: Nastavimo privzeto vrednost za uro
      });
    }

    rounds.push({
      matches: roundMatches,
      byeTeamName: liho ? byeTeamName : null,
    });

    rotating = [rotating[rotating.length - 1], ...rotating.slice(0, -1)];
  }

  return rounds;
}

function dvokrozno(rounds) {
  const secondHalf = [];

  for (let r = 0; r < rounds.length; r++) {
    const roundObj = rounds[r];
    const newMatches = [];

    for (let i = 0; i < roundObj.matches.length; i++) {
      const m = roundObj.matches[i];

      newMatches.push({
        id: `m-r${rounds.length + (r + 1)}-${i}`,
        round: rounds.length + (r + 1),
        homeTeamId: m.awayTeamId,
        awayTeamId: m.homeTeamId,
        home: m.away, 
        away: m.home, 
        scoreHome: null,
        scoreAway: null,
        phase: "league",
        date: "",  // <-- NOVO
        time: ""   // <-- NOVO
      });
    }

    secondHalf.push({
      matches: newMatches,
      byeTeamName: roundObj.byeTeamName,
    });
  }

  return [...rounds, ...secondHalf];
}

export default function LeagueDraw({ teams, onChangeMatches, isHybrid }) {
  const [isDouble, setIsDouble] = useState(false);
  
  // Lokalno stanje za hranjenje krogov z vnosi za datume in ure
  const [localRounds, setLocalRounds] = useState([]);

  const safeTeams = useMemo(() => pripraviEkipe(teams), [teams]);

  // Generiranje krogov ob spremembi ekip ali načina igranja (eno/dvokrožno)
  const generiraniKrogi = useMemo(() => {
    const firstHalf = generirajKroge(safeTeams);
    return isDouble ? dvokrozno(firstHalf) : firstHalf;
  }, [safeTeams, isDouble]);

  // Ko se generirajo novi krogi, osvežimo lokalno stanje
  useEffect(() => {
    setLocalRounds(generiraniKrogi);
  }, [generiraniKrogi]);

  // Sprožimo onChangeMatches navzgor vsakič, ko se spremeni lokalno stanje (tudi ko uporabnik vpiše datum/uro)
  useEffect(() => {
    const vseTekme = localRounds.flatMap(roundObj => roundObj.matches);
    if (vseTekme.length > 0) {
      onChangeMatches(vseTekme);
    }
  }, [localRounds, onChangeMatches]);

  // Funkcija, ki posodobi polje (date ali time) za določeno tekmo
  const handleMatchMetaChange = (roundIdx, matchIdx, field, value) => {
    setLocalRounds(prevRounds => {
      const noviKrogi = [...prevRounds];
      const novaTekma = { ...noviKrogi[roundIdx].matches[matchIdx], [field]: value };
      
      const noveTekmeUKrogu = [...noviKrogi[roundIdx].matches];
      noveTekmeUKrogu[matchIdx] = novaTekma;
      
      noviKrogi[roundIdx] = {
        ...noviKrogi[roundIdx],
        matches: noveTekmeUKrogu
      };
      
      return noviKrogi;
    });
  };

  if (!safeTeams || safeTeams.length < 2) {
    return <div className={classes.infoBox}>Najprej dodaj ekipe.</div>;
  }

  return (
    <>
      <div className={classes.toggleRow}>
        <button
          type="button"
          className={`${classes.toggleBtn} ${!isDouble ? classes.toggleBtnActive : ""}`}
          onClick={() => setIsDouble(false)}
        >
          Enokrožni
        </button>

        <button
          type="button"
          className={`${classes.toggleBtn} ${isDouble ? classes.toggleBtnActive : ""}`}
          onClick={() => setIsDouble(true)}
        >
          Dvokrožni
        </button>
      </div>

      <div className={classes.roundList}>
        {localRounds.map((round, roundIdx) => (
          <section key={roundIdx} className={classes.roundCard}>
            <h3 className={classes.roundTitle}>Krog {roundIdx + 1}</h3>

            {round.byeTeamName && (
              <div className={classes.roundMeta}>
                Prosta ekipa: <strong>{round.byeTeamName}</strong>
              </div>
            )}

            <div className={classes.roundMatches}>
              {round.matches.map((m, matchIdx) => (
                <div key={m.id || matchIdx} className={classes.matchRow}>
                  {/* Imena ekip */}
                  <div className={classes.teamsInfo}>
                    <span className={classes.teamName}>{m.home}</span>
                    <span className={classes.vs}>vs</span>
                    <span className={classes.teamName}>{m.away}</span>
                  </div>

                  {/* NOVO: Polja za vnos datuma in ure */}
                  <div className={classes.matchInputs}>
                    <input
                      type="date"
                      className={classes.dateInput}
                      value={m.date || ""}
                      onChange={(e) => handleMatchMetaChange(roundIdx, matchIdx, "date", e.target.value)}
                    />
                    <input
                      type="time"
                      className={classes.timeInput}
                      value={m.time || ""}
                      onChange={(e) => handleMatchMetaChange(roundIdx, matchIdx, "time", e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}