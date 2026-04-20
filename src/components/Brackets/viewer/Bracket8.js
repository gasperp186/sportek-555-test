"use client";

import classes from "./Bracket8.module.css";
import Match from "./Match";

export default function Bracket8({ matches, basePath = "", isExport = false }) {
  // 1. krog (Četrtfinale)
  const qf1 = matches.find((m) => m.round === "QF1");
  const qf2 = matches.find((m) => m.round === "QF2");
  const qf3 = matches.find((m) => m.round === "QF3");
  const qf4 = matches.find((m) => m.round === "QF4");

  // Polfinale
  const sf1 = matches.find((m) => m.round === "SF1");
  const sf2 = matches.find((m) => m.round === "SF2");

  // Finale
  const f1 = matches.find((m) => m.round === "F1");
  const t3 = matches.find((m) => m.round === "T3");

  function formatDate(dateStr) {
    if (!dateStr) return "\u00A0";
    if (typeof dateStr === "string" && dateStr.includes("-")) {
      const [year, month, day] = dateStr.split("-");
      return `${day}.${month}.${year}`;
    }
    return dateStr;
  }

  function teamRow(name, score, status) {
    // name je lahko objekt {name: "Ekipa"} ali string "Ekipa"
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
      {/* 1. STOLPEC: LEVO ČETRTFINALE */}
      <div className={`
        ${isExport ? classes.col2 : classes.col} 
        ${isExport ? classes.colRound2 : classes.colRound} 
        ${!isExport ? classes.order1 : ""}
    `}>
    {!isExport && <h3 className={classes.onlyMobileTitle}>Četrtfinale</h3>}
        <Match
          id={qf1?.id}
          basePath={basePath}
          status={qf1?.status}
          date={formatDate(qf1?.date)}
          time={qf1?.time}
          city={qf1?.city}
          roundTitle={"Četrtfinale"}
          top={teamRow(qf1?.home, qf1?.homeScore)}
          bottom={teamRow(qf1?.away, qf1?.awayScore)}
          classes={classes}
          isExport={isExport}
        />
        <Match
          id={qf2?.id}
          basePath={basePath}
          status={qf2?.status}
          date={formatDate(qf2?.date)}
          time={qf2?.time}
          city={qf2?.city}
          top={teamRow(qf2?.home, qf2?.homeScore, qf2?.status)}
          bottom={teamRow(qf2?.away, qf2?.awayScore, qf2?.status)}
          classes={classes}
          isExport={isExport}
        />
      </div>

     <div className={`
               ${isExport ? classes.col2 : classes.col} 
               ${isExport ? classes.colSemi2 : classes.colSemi} 
               ${!isExport ? classes.order3 : ""}
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
          roundTitle={"Polfinale"}
          top={teamRow(sf1?.home, sf1?.homeScore, sf1?.status)}
          bottom={teamRow(sf1?.away, sf1?.awayScore, sf1?.status)}
          classes={classes}
          isExport={isExport}
        />
      </div>

      <div className={`
               ${isExport ? classes.col2 : classes.col} 
               ${isExport && t3 ? classes.colFinals2 : (!isExport && t3 ? classes.colFinals : "")}
               ${!isExport ? classes.order5 : ""}
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
          ${!isExport ? classes.order3 : ""}
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

      {/* 5. STOLPEC: DESNO ČETRTFINALE */}
      <div className={`
        ${isExport ? classes.col2 : classes.col} 
        ${isExport ? classes.colRound2 : classes.colRound} 
        ${!isExport ? classes.order1 : ""}
    `}>
        <Match
          id={qf3?.id}
          basePath={basePath}
          status={qf3?.status}
          date={formatDate(qf3?.date)}
          time={qf3?.time}
          city={qf3?.city}
          roundTitle={"Četrtfinale"}
          top={teamRow(qf3?.home, qf3?.homeScore, qf3?.status)}
          bottom={teamRow(qf3?.away, qf3?.awayScore, qf3?.status)}
          classes={classes}
          isExport={isExport}
        />
        <Match
          id={qf4?.id}
          basePath={basePath}
          status={qf4?.status}
          date={formatDate(qf4?.date)}
          time={qf4?.time}
          city={qf4?.city}
          top={teamRow(qf4?.home, qf4?.homeScore, qf4?.status)}
          bottom={teamRow(qf4?.away, qf4?.awayScore, qf4?.status)}
          classes={classes}
          isExport={isExport}
        />
      </div>
      </div>
    
    
    </div> 
  );
}