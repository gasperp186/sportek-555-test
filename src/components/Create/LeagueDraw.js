"use client";

import { useMemo, useState, useEffect } from "react";
import classes from "./Draw.module.css"; 
import "./Create.module.css";

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

      // POPRAVEK: Če je katera od ekip BYE, takoj vemo, katera ekipa počiva v tem krogu
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
        round: r + 1,
        homeTeamId: home.id,
        awayTeamId: away.id,
        home: home.name,
        away: away.name,
        scoreHome: null,
        scoreAway: null,
        phase: "league"
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
        round: rounds.length + (r + 1),
        homeTeamId: m.awayTeamId,
        awayTeamId: m.homeTeamId,
        home: m.away, 
        away: m.home, 
        scoreHome: null,
        scoreAway: null,
        phase: "league"
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

  const safeTeams = useMemo(() => pripraviEkipe(teams), [teams]);

  const rounds = useMemo(() => {
    const firstHalf = generirajKroge(safeTeams);
    return isDouble ? dvokrozno(firstHalf) : firstHalf;
  }, [safeTeams, isDouble]);

  useEffect(() => {
    const vseTekme = rounds.flatMap(roundObj => roundObj.matches);

    if (vseTekme.length > 0) {
      onChangeMatches(vseTekme);
    }
  }, [rounds, onChangeMatches]);

  if (!safeTeams || safeTeams.length < 2) {
    return <div className={classes.infoBox}>Najprej dodaj ekipe.</div>;
  }

  return (
    <>
      <div className={classes.toggleRow}>
        <button
          type="button"
          className={`${classes.toggleBtn} ${
            !isDouble ? classes.toggleBtnActive : ""
          }`}
          onClick={() => setIsDouble(false)}
        >
          Enokrožni
        </button>

        <button
          type="button"
          className={`${classes.toggleBtn} ${
            isDouble ? classes.toggleBtnActive : ""
          }`}
          onClick={() => setIsDouble(true)}
        >
          Dvokrožni
        </button>
      </div>

      <div className={classes.roundList}>
        {rounds.map((round, idx) => (
          <section key={idx} className={classes.roundCard}>
            <h3 className={classes.roundTitle}>Krog {idx + 1}</h3>

            {round.byeTeamName && (
              <div className={classes.roundMeta}>
                Prosta ekipa: <strong>{round.byeTeamName}</strong>
              </div>
            )}

            <div className={classes.roundMatches}>
              {round.matches.map((m, i) => (
                <div key={i} className={classes.matchRow}>
                  <span className={classes.teamName}>{m.home}</span>
                  <span className={classes.vs}>vs</span>
                  <span className={classes.teamName}>{m.away}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}