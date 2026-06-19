"use client";

import LeagueRound from "./LeagueMatchRow";
import classes from "./League.module.css";
import classes2 from "./LeagueScreenShot.module.css"
import { useState, useMemo } from "react";

export default function LeagueView({ matches, teams, id, isExport }) {
  // 1. Izračun začetnega kroga
  const initialRound = useMemo(() => {
    if (!matches || matches.length === 0) return 1;

    const matchesByRound = matches.reduce((acc, m) => {
      const r = m.round || 1;
      if (!acc[r]) acc[r] = [];
      acc[r].push(m);
      return acc;
    }, {});

    const roundKeys = Object.keys(matchesByRound)
      .map(Number)
      .filter(num => !isNaN(num))
      .sort((a, b) => a - b);

    let lastFinished = 0;
    for (const r of roundKeys) {
      if (matchesByRound[r].every(m => m.completed)) {
        lastFinished = r;
      } else {
        break; 
      }
    }

    const maxR = Math.max(...roundKeys);
    return lastFinished < maxR ? lastFinished + 1 : maxR;
  }, [matches]);

  const [selectedRound, setSelectedRound] = useState(initialRound);

  // 2. Izračun lestvice
  const lestvicaSorted = useMemo(() => {
    const table = teams.map(t => ({ 
      team: t, P: 0, PTS: 0, W: 0, D: 0, L: 0, GD: 0 
    }));

    matches.forEach((match) => {
      if (typeof match.round !== 'number' && isNaN(Number(match.round))) return;
      if (match.status !== "Končana" || match.homeScore === null || match.awayScore === null) return;
      
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
        home.PTS += 3;
        home.W += 1; 
        away.L += 1; 
      }
      else if (hScore < aScore) { 
        away.PTS += 3;
        away.W += 1; 
        home.L += 1; 
      }
      else { 
        home.PTS += 1;
        away.PTS += 1; 
        home.D += 1; 
        away.D += 1; 
      }
      home.GD += (hScore - aScore);
      away.GD += (aScore - hScore);
    });

    return [...table].sort((a, b) => b.PTS - a.PTS || b.GD - a.GD);
  }, [matches, teams]);

  const matchesByRound = useMemo(() => {
    return matches.reduce((acc, match) => {
      if (typeof match.round !== 'number' && isNaN(Number(match.round))) return acc;
      const r = match.round || 1;
      if (!acc[r]) acc[r] = [];
      acc[r].push(match);
      return acc;
    }, {});
  }, [matches]);

  const roundKeys = Object.keys(matchesByRound).map(Number).sort((a, b) => a - b);
  const maxRound = roundKeys.length > 0 ? Math.max(...roundKeys) : 1;

  // Standardni prikaz
  const renderStandardGrid = () => (
    <div className={classes.leagueGrid}>
      <div className={classes.left}>
        <h4 className={classes.tableTitle}>Lestvica</h4>
        <table className={classes.table}>
          <thead>
            <tr>
              <th className={classes.teamTh}>Ekipa</th>
              <th className={`${classes.num} ${classes.colNumHeader}`} title="Odigrane tekme">OT</th>
              <th className={`${classes.num} ${classes.colNumHeader}`} title="Točke">T</th>              
              <th className={`${classes.num} ${classes.colNumHeader}`} title="Zmage">Z</th>
              <th className={`${classes.num} ${classes.colNumHeader}`} title="Neodločeno">N</th>
              <th className={`${classes.num} ${classes.colNumHeader}`} title="Porazi">P</th>
              <th className={`${classes.num} ${classes.colNumHeader}`} title="Razlika točk">RT</th>
            </tr>
          </thead>
          <tbody>
            {lestvicaSorted.map((row) => (
              <tr key={row.team.id}>
                <td className={classes.teamTd}>{row.team.name}</td>
                <td className={classes.num}>{row.P}</td>
                <td className={classes.num} style={{ fontWeight: 'bold' }}>{row.PTS}</td>
                <td className={classes.num}>{row.W}</td>
                <td className={classes.num}>{row.D}</td>
                <td className={classes.num}>{row.L}</td>
                <td className={classes.num}>{row.GD}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={classes.right}>
        <div className={classes.roundToolbar}>
          <button 
            onClick={() => setSelectedRound(s => Math.max(1, s - 1))} 
            disabled={selectedRound === 1} 
            className={classes.smallBtn}
          >
            Nazaj
          </button>

          <h4 className={classes.roundTitle}>Krog {selectedRound} / {maxRound}</h4>

          <button 
            onClick={() => setSelectedRound(s => Math.min(maxRound, s + 1))} 
            disabled={selectedRound === maxRound} 
            className={classes.smallBtn}
          >
            Naprej
          </button>
        </div>

        <div className={classes.allRoundsContainer}>
          {matchesByRound[selectedRound] ? (
            <div className={classes.roundWrapper}>
              <LeagueRound 
                matchesThisRound={matchesByRound[selectedRound]} 
                basePath={`/Competitions/${id}`} 
                classes={classes} 
                isExport={false}
              />
            </div>
          ) : (
            <p className={classes.noMatches}>Za ta krog ni razpisanih tekem.</p>
          )}
        </div>
      </div>
    </div>
  );

  // Export prikaz
  const renderExportGrid = () => (
    <div className={classes2.exportWrapper}>
      <div className={classes2.leagueGridExport}>
        <div className={`${classes2.right} ${classes2.colExport}`}>
          <h4 className={classes2.roundTitle}>Krog {selectedRound} / {maxRound}</h4>
          <div className={classes2.allRoundsContainer}>
            {matchesByRound[selectedRound] ? (
              <div className={classes2.roundWrapper}>
                <LeagueRound 
                  matchesThisRound={matchesByRound[selectedRound]} 
                  basePath={`/Competitions/${id}`} 
                  classes={classes2} 
                  isExport={true}
                />
              </div>
            ) : (
              <p className={classes2.noMatches}>Za ta krog ni razpisanih tekem.</p>
            )}
          </div>
        </div>

        <div className={`${classes2.left} ${classes2.colExport}`}>
          <h4 className={classes2.tableTitle}>Lestvica</h4>
          <table className={classes2.table}>
            <thead>
              <tr>
                <th className={classes2.teamTh}>Ekipa</th>
                <th className={`${classes2.num} ${classes2.colNumHeader}`}>Odigrane tekme</th>
                <th className={`${classes2.num} ${classes2.colNumHeader}`}>Točke</th>              
                <th className={`${classes2.num} ${classes2.colNumHeader}`}>Zmage</th>
                <th className={`${classes2.num} ${classes2.colNumHeader}`}>Neodločen izid</th>
                <th className={`${classes2.num} ${classes2.colNumHeader}`}>Porazi</th>
                <th className={`${classes2.num} ${classes2.colNumHeader}`}>Razlika točk</th>
              </tr>
            </thead>
            <tbody>
              {lestvicaSorted.map((row) => (
                <tr key={row.team.id}>
                  <td className={classes2.teamTd}>{row.team.name}</td>
                  <td className={classes2.num}>{row.P}</td>
                  <td className={classes2.num} style={{ fontWeight: 'bold' }}>{row.PTS}</td>
                  <td className={classes2.num}>{row.W}</td>
                  <td className={classes2.num}>{row.D}</td>
                  <td className={classes2.num}>{row.L}</td>
                  <td className={classes2.num}>{row.GD}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return isExport ? renderExportGrid() : renderStandardGrid();
}