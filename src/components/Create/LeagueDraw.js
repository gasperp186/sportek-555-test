"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useMemo, useState, useEffect } from "react";
import classes from "./Draw.module.css"; 

import {
  toDateOrNull,
  toTimeDateOrNull,
  formatYMD,
  formatHM,
} from "@/lib/DateTime";

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
        id: `m-r${r + 1}-${i}`, 
        round: r + 1,
        homeTeamId: home.id,
        awayTeamId: away.id,
        home: home.name,
        away: away.name,
        scoreHome: null,
        scoreAway: null,
        phase: "league",
        date: "",  
        time: ""   
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
        date: "",  
        time: ""   
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
  const [localRounds, setLocalRounds] = useState([]);

  const safeTeams = useMemo(() => pripraviEkipe(teams), [teams]);

  const generiraniKrogi = useMemo(() => {
    const firstHalf = generirajKroge(safeTeams);
    return isDouble ? dvokrozno(firstHalf) : firstHalf;
  }, [safeTeams, isDouble]);

  useEffect(() => {
    setLocalRounds(generiraniKrogi);
  }, [generiraniKrogi]);

  useEffect(() => {
    const vseTekme = localRounds.flatMap(roundObj => roundObj.matches);
    if (vseTekme.length > 0) {
      onChangeMatches(vseTekme);
    }
  }, [localRounds, onChangeMatches]);

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
              {round.matches.map((m, matchIdx) => {
                // Pretvorba shranjenih nizov v Date objekte za react-datepicker
                const selectedDate = toDateOrNull(m.date);
                const selectedTime = toTimeDateOrNull(m.time);

                return (
                  <div key={m.id || matchIdx} className={classes.matchRow}>
                    {/* Imena ekip */}
                    <div className={classes.teamsInfo}>
                      <span className={classes.teamName}>{m.home}</span>
                      <span className={classes.vs}>vs</span>
                      <span className={classes.teamName}>{m.away}</span>
                    </div>

                    {/* Izbira datuma in ure z enakimi komponentami kot v MatchCard */}
                    <div className={classes.metaRow}>
                      <div className={classes.datetimeBlock}>
                        <span className={classes.metaLabel}>Datum</span>
                        <DatePicker
                          selected={selectedDate}
                          onChange={(d) => handleMatchMetaChange(roundIdx, matchIdx, "date", d ? formatYMD(d) : "")}
                          dateFormat="dd.MM.yyyy"
                          placeholderText="Datum"
                          className={classes.dpInput}
                        />
                      </div>

                      <div className={classes.datetimeBlock}>
                        <span className={classes.metaLabel}>Ura</span>
                        <DatePicker
                          selected={selectedTime}
                          onChange={(d) => handleMatchMetaChange(roundIdx, matchIdx, "time", d ? formatHM(d) : "")}
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

                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}