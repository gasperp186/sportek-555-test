// components/Competitions/LeagueView.js
"use client";

import LeagueRound from "./LeagueMatchRow";
import classes from "./League.module.css";
import { useState, useMemo } from "react";

export default function LeagueView({ matches, teams, id, isExport }) {
  // 1. Izračun začetnega kroga (prvi nekončan krog ali zadnji krog)
  const initialRound = useMemo(() => {
    if (!matches || matches.length === 0) return 1;

    // Najdemo vse kroge, ki so v celoti zaključeni
    const matchesByRound = matches.reduce((acc, m) => {
      const r = m.round || 1;
      if (!acc[r]) acc[r] = [];
      acc[r].push(m);
      return acc;
    }, {});

    const roundKeys = Object.keys(matchesByRound).map(Number).sort((a, b) => a - b);
    
    let lastFinished = 0;
    for (const r of roundKeys) {
      if (matchesByRound[r].every(m => m.completed)) {
        lastFinished = r;
      } else {
        break; 
      }
    }

    const maxR = Math.max(...roundKeys);
    // Avtomatsko prikažemo naslednji krog, če obstaja, sicer zadnjega
    return lastFinished < maxR ? lastFinished + 1 : maxR;
  }, [matches]);

  // Stanje za krog, ki ga uporabnik dejansko gleda (lahko prosto spreminja)
  const [selectedRound, setSelectedRound] = useState(initialRound);

  // 2. Izračun lestvice
  const lestvicaSorted = useMemo(() => {
    const table = teams.map(t => ({ 
      team: t, P: 0, PTS: 0, W: 0, D: 0, L: 0, GD: 0 
    }));

    matches.forEach((match) => {
      // Tekma mora biti končana in imeti rezultat, da šteje za lestvico
      if (match.status !== "finished" || match.homeScore === null || match.awayScore === null) return;
      
      const homeName = match.homeTeam ?? match.home;
      const awayName = match.awayTeam ?? match.away;
      
      let home = table.find((t) => t.team.name === homeName);
      let away = table.find((t) => t.team.name === awayName);

      if (!home || !away) return;

      home.P += 1; 
      away.P += 1;
      const hScore = Number(match.homeScore);
      const aScore = Number(match.awayScore);

      if (hScore > aScore) { 
        home.PTS += 3; // Zmaga
        home.W += 1; 
        away.L += 1; 
      }
      else if (hScore < aScore) { 
        away.PTS += 3; // Zmaga
        away.W += 1; 
        home.L += 1; 
      }
      else { 
        home.PTS += 1; // Remi
        away.PTS += 1; 
        home.D += 1; 
        away.D += 1; 
      }
      home.GD += (hScore - aScore);
      away.GD += (aScore - hScore);
    });

    return [...table].sort((a, b) => b.PTS - a.PTS || b.GD - a.GD);
  }, [matches, teams]);

  // 3. Priprava podatkov za kroge
  const matchesByRound = useMemo(() => {
    return matches.reduce((acc, match) => {
      const r = match.round || 1;
      if (!acc[r]) acc[r] = [];
      acc[r].push(match);
      return acc;
    }, {});
  }, [matches]);

  const roundKeys = Object.keys(matchesByRound).map(Number).sort((a, b) => a - b);
  const maxRound = roundKeys.length > 0 ? Math.max(...roundKeys) : 1;

  return (
    <div className={classes.leagueGrid}>
      {/* LEVA STRAN: Lestvica */}
      <div className={classes.left}>
        <h4 className={classes.tableTitle}>Lestvica</h4>
        <table className={classes.table}>
          <thead>
            <tr>
              <th>Ekipa</th>
              <th className={classes.num}>OD</th>
              <th className={classes.num}>Z</th>
              <th className={classes.num}>Toč</th>
            </tr>
          </thead>
          <tbody>
            {lestvicaSorted.map((row) => (
              <tr key={row.team.id}>
                <td>{row.team.name}</td>
                <td className={classes.num}>{row.P}</td>
                <td className={classes.num}>{row.W}</td>
                <td className={classes.num}>{row.PTS}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DESNA STRAN: Tekme po krogih */}
      <div className={classes.right}>
        <div className={classes.roundToolbar}>
          <h4 className={classes.roundTitle}>Krog {selectedRound} / {maxRound}</h4>
          <div className={ isExport ? classes.roundBtns2 : classes.roundBtns}>
            <button 
              onClick={() => setSelectedRound(s => Math.max(1, s - 1))} 
              disabled={selectedRound === 1} 
              className={classes.smallBtn}
            >
              Nazaj
            </button>
            <button 
              onClick={() => setSelectedRound(s => Math.min(maxRound, s + 1))} 
              disabled={selectedRound === maxRound} 
              className={classes.smallBtn}
            >
              Naprej
            </button>
          </div>
        </div>

        <div className={classes.allRoundsContainer}>
          {matchesByRound[selectedRound] ? (
            <div className={classes.roundWrapper}>
              <LeagueRound 
                matchesThisRound={matchesByRound[selectedRound]} 
                basePath={`/Competitions/${id}`} 
                classes={classes} 
              />
            </div>
          ) : (
            <p className={classes.noMatches}>Za ta krog ni razpisanih tekem.</p>
          )}
        </div>
      </div>
    </div>
  );
}