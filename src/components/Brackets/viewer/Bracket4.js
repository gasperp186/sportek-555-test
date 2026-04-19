"use client";

import classes from "./Bracket4.module.css";
import Match from "./Match";

export default function Bracket4({ matches, basePath = "", isExport = false }) {
  // Iskanje tekem
  const sf1 = matches.find(m => m.round === "SF1");
  const sf2 = matches.find(m => m.round === "SF2");
  const f1 = matches.find(m => m.round === "F1");
  const t3 = matches.find(m => m.round === "T3");

  function formatDate(dateStr) {
    if (!dateStr) return "\u00A0"; 
    if (typeof dateStr === "string" && dateStr.includes("-")) {
      const [year, month, day] = dateStr.split("-");
      return `${day}.${month}.${year}`;
    }
    return dateStr;
  }

  function teamRow(name, score, status) {
    const teamName = name?.name || name || "";
    return (
      <>
        {teamName ? teamName : "\u00A0"}
        <span className={classes.score}>
          {status === "scheduled" ? "–" : (score ?? "–")}
        </span>
      </>
    );
  }

  return (
    <div className={isExport ? classes.dvaDela2 : classes.dvaDela}>

<div className={isExport ? classes.container2 : classes.container}>
  
  {/* 1. STOLPEC: SF1 (Na mobiju prvi, v Exportu levi) */}
  <div className={`
    ${isExport ? classes.col2 : classes.col} 
    ${!isExport ? classes.order1 : ""} 
  `}>
    {!isExport && <h3 className={classes.onlyMobileTitle}>Polfinale</h3>}
    <Match
      {...sf1}
      roundTitle={isExport ? "Polfinale" : null}
      isExport={isExport}
    />
  </div>

  {/* 2. STOLPEC: FINALE (Na mobiju ZADNJI (order 3), v Exportu SREDINSKI) */}
  <div className={`
    ${isExport ? classes.col2 : classes.col} 
    ${!isExport ? classes.order3 : ""} 
  `}>
    {!isExport && <h3 className={classes.onlyMobileTitle}>Finalni boji</h3>}
    {/* Tukaj gresta f1 in t3 eden pod drugega */}
    <Match {...f1} roundTitle={isExport ? "Finale" : null} isExport={isExport} />
    {t3 && <Match {...t3} roundTitle={isExport ? "3. mesto" : null} isExport={isExport} />}
  </div>

  {/* 3. STOLPEC: SF2 (Na mobiju DRUGI (order 1), v Exportu DESNI) */}
  <div className={`
    ${isExport ? classes.col2 : classes.col} 
    ${!isExport ? classes.order1 : ""} 
  `}>
    <Match
      {...sf2}
      roundTitle={isExport ? "Polfinale" : null}
      isExport={isExport}
    />
  </div>

</div>
    </div>
  );
}