"use client";

import classes from "./Bracket4.module.css";
import Match from "./Match";
import { formatDate } from "@/components/formatDate";

export default function Bracket4({ matches, basePath = "", isExport = false }) {
  // Iskanje tekem po rundah
  const sf1 = matches.find(m => m.round === "SF1");
  const sf2 = matches.find(m => m.round === "SF2");
  const f1 = matches.find(m => m.round === "F1");
  const t3 = matches.find(m => m.round === "T3");

 

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
        
        {/* 1. STOLPEC: POLFINALE 1 */}
        <div className={`
          ${isExport ? classes.col2 : classes.col} 
          ${isExport ? classes.colSemi2 : classes.colSemi} 
          ${!isExport ? classes.order1 : ""}
        `}>
          {/* Skupni naslov samo za mobitel - izpiše se samo TU za oba polfinala */}
          {!isExport && <h3 className={classes.onlyMobileTitle}>Polfinale</h3>}
          
          <Match
            id={sf1?.id}
            basePath={basePath}
            status={sf1?.status}
            date={formatDate(sf1?.date)}          
            time={sf1?.time}
            city={sf1?.city}
            roundTitle={"Polfinale 1"} // Na mobiju null, ker imamo onlyMobileTitle
            top={teamRow(sf1?.home, sf1?.homeScore)}
            bottom={teamRow(sf1?.away, sf1?.awayScore)}
            classes={classes}
            isExport={isExport}
          />
        </div>

        {/* 2. STOLPEC: FINALE (Na mobiju pride zadnji zaradi order3) */}
        <div className={`
          ${isExport ? classes.col2 : classes.col} 
          ${isExport && t3 ? classes.colFinals2 : (!isExport && t3 ? classes.colFinals : "")}
          ${!isExport ? classes.order3 : ""}
        `}>
          {!isExport && <h3 className={classes.onlyMobileTitle}>Finale</h3>}
          
          <Match
            id={f1?.id}
            basePath={basePath}
            status={f1?.status}
            date={formatDate(f1?.date)} 
            time={f1?.time}
            city={f1?.city}
            roundTitle={isExport ? "Finale" : "Finale"} // Tukaj lahko pustimo, ker je ena tekma
            top={teamRow(f1?.home, f1?.homeScore)}
            bottom={teamRow(f1?.away, f1?.awayScore)}
            classes={classes}
            isExport={isExport}
          /> 
          {t3 && !isExport && <h3 className={classes.onlyMobileTitle}>Tekma za 3. mesto</h3>}
          {t3 &&  (
            <Match
              id={t3?.id}
              basePath={basePath}
              status={t3?.status}
              date={formatDate(t3?.date)} 
              time={t3?.time}
              city={t3?.city}
              roundTitle={isExport ? "Tekma za 3. mesto" : "Tekma za 3. mesto"}
              top={teamRow(t3?.home, t3?.homeScore)}
              bottom={teamRow(t3?.away, t3?.awayScore)}
              classes={classes}
              isExport={isExport}
            />
          )}
        </div>

        {/* 3. STOLPEC: POLFINALE 2 */}
        <div className={`
          ${isExport ? classes.col2 : classes.col} 
          ${isExport ? classes.colSemi2 : classes.colSemi} 
          ${!isExport ? classes.order1 : ""}
        `}>
          {/* TUKAJ NE dodamo onlyMobileTitle, da bo na telefonu samo eden naslov za obe tekmi */}
          <Match
            id={sf2?.id}
            basePath={basePath}
            status={sf2?.status}
            date={formatDate(sf2?.date)} 
            time={sf2?.time}
            city={sf2?.city}
            roundTitle={"Polfinale 2"}
            top={teamRow(sf2?.home, sf2?.homeScore)}
            bottom={teamRow(sf2?.away, sf2?.awayScore)}
            classes={classes}
            isExport={isExport}
          />
        </div>

      </div>
    </div>
  );
}