// src/components/Brackets/viewer/Bracket16.jsx
"use client";

import classes from "./Bracket16.module.css";
import Match from "./Match";

export default function Bracket16({ matches, basePath = "", isExport = false }) {

  //Osmina finala

  const r16_1 = matches.find((m) => m.round ==="R16_1");
  const r16_2 = matches.find((m) => m.round ==="R16_2");
  const r16_3 = matches.find((m) => m.round ==="R16_3");
  const r16_4 = matches.find((m) => m.round ==="R16_4");
  const r16_5 = matches.find((m) => m.round ==="R16_5");
  const r16_6 = matches.find((m) => m.round ==="R16_6");
  const r16_7 = matches.find((m) => m.round ==="R16_7");
  const r16_8 = matches.find((m) => m.round ==="R16_8");

  // Četrtfinale
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

      <div className={isExport 
    ? `${classes.col2} ${classes.colRound2} ${classes.orderR1}` 
    : `${classes.col} ${classes.colRound} ${classes.orderR1}`
  }>
        <Match
          id={r16_1?.id}
          basePath={basePath}
          status={r16_1?.status}
          date={formatDate(r16_1?.date)}
          time={r16_1?.time}
          city={r16_1?.city}
          roundTitle="Osmina finala"
          top={teamRow(r16_1?.home, r16_1?.homeScore, r16_1?.status)}
          bottom={teamRow(r16_1?.away, r16_1?.awayScore, r16_1?.status)}
          classes={classes}
          isExport={isExport}
        />
        <Match
          id={r16_2?.id}
          basePath={basePath}
          status={r16_2?.status}
          date={formatDate(r16_2?.date)}
          time={r16_2?.time}
          city={r16_2?.city}
          top={teamRow(r16_2?.home, r16_2?.homeScore, r16_2?.status)}
          bottom={teamRow(r16_2?.away, r16_2?.awayScore, r16_2?.status)}
          classes={classes}
          isExport={isExport}
        />
        <Match
          id={r16_3?.id}
          basePath={basePath}
          status={r16_3?.status}
          date={formatDate(r16_3?.date)}
          time={r16_3?.time}
          city={r16_3?.city}
          top={teamRow(r16_3?.home, r16_3?.homeScore, r16_3?.status)}
          bottom={teamRow(r16_3?.away, r16_3?.awayScore, r16_3?.status)}
          classes={classes}
          isExport={isExport}
        />
        <Match
          id={r16_4?.id}
          basePath={basePath}
          status={r16_4?.status}
          date={formatDate(r16_4?.date)}
          time={r16_4?.time}
          city={r16_4?.city}
          top={teamRow(r16_4?.home, r16_4?.homeScore, r16_4?.status)}
          bottom={teamRow(r16_4?.away, r16_4?.awayScore, r16_4?.status)}
          classes={classes}
          isExport={isExport}
        />

       

      
      </div>

      <div className={isExport 
    ? `${classes.col2} ${classes.colQuarter2} ${classes.orderR2}` 
    : `${classes.col} ${classes.colQuarter}   ${classes.orderR2}`
  }>
        <Match
          id={qf1?.id}
          basePath={basePath}
          status={qf1?.status}
          date={formatDate(qf1?.date)}
          time={qf1?.time}
          city={qf1?.city}
          roundTitle="Četrtfinale"
          top={teamRow(qf1?.home, qf1?.homeScore, qf1?.status)}
          bottom={teamRow(qf1?.away, qf1?.awayScore, qf1?.status)}
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

      <div className={isExport 
    ? `${classes.col2} ${classes.colSemi2} ${classes.orderR3}` 
    : `${classes.col} ${classes.colSemi}   ${classes.orderR3}`
  }>
       <Match
          id={sf1?.id}
          basePath={basePath}
          status={sf1?.status}
          date={formatDate(sf1?.date)}
          time={sf1?.time}
          city={sf1?.city}
          roundTitle="Polfinale"
          top={teamRow(sf1?.home, sf1?.homeScore, sf1?.status)}
          bottom={teamRow(sf1?.away, sf1?.awayScore, sf1?.status)}
          classes={classes}
          isExport={isExport}
        />
      </div>

      {!t3 ? <div className='${classes.col} ${classes.orderR1}'>
              <Match
                id={f1?.id}
                basePath={basePath}
                status={f1?.status}
                date={formatDate(f1?.date)} 
                time={f1?.time}
                city={f1?.city}
                roundTitle="Finale za 1. mesto"
                top={teamRow(f1?.home, f1?.homeScore)}
                bottom={teamRow(f1?.away, f1?.awayScore)}
                classes={classes}
                isExport={isExport}
              /> </div> :   
      
              <div className={isExport 
    ? `${classes.col2} ${classes.colFinals2} ${classes.orderR4}` 
    : `${classes.col} ${classes.colFinals}   ${classes.orderR4}`
  }>
              <Match
                id={f1?.id}
                basePath={basePath}
                status={f1?.status}
                date={formatDate(f1?.date)} 
                time={f1?.time}
                city={f1?.city}
                roundTitle="Finale za 1. mesto"
                top={teamRow(f1?.home, f1?.homeScore)}
                bottom={teamRow(f1?.away, f1?.awayScore)}
                classes={classes}
                isExport={isExport}
              /> 
             <Match
                id={t3?.id}
                basePath={basePath}
                status={t3?.status}
                date={formatDate(t3?.date)} 
                time={t3?.time}
                city={t3?.city}
                roundTitle="Tekma za 3. mesto"
                top={teamRow(t3?.home, t3?.homeScore)}
                bottom={teamRow(t3?.away, t3?.awayScore)}
                classes={classes}
                isExport={isExport}
              />
              </div>
              }

      <div className={isExport 
    ? `${classes.col2} ${classes.colSemi2} ${classes.orderR3}` 
    : `${classes.col} ${classes.colSemi}   ${classes.orderR3}`
  }>
        <Match
          id={sf2?.id}
          basePath={basePath}
          status={sf2?.status}
          date={formatDate(sf2?.date)}
          time={sf2?.time}
          city={sf2?.city}
          roundTitle="Polfinale"
          top={teamRow(sf2?.home, sf2?.homeScore, sf2?.status)}
          bottom={teamRow(sf2?.away, sf2?.awayScore, sf2?.status)}
          classes={classes}
          isExport={isExport}
        />
      </div>

      <div className={isExport 
    ? `${classes.col2} ${classes.colQuarter2} ${classes.orderR2}` 
    : `${classes.col} ${classes.colQuarter}   ${classes.orderR2}`
  }>
         <Match
          id={qf3?.id}
          basePath={basePath}
          status={qf3?.status}
          date={formatDate(qf3?.date)}
          time={qf3?.time}
          city={qf3?.city}
          roundTitle="Četrtfinale"
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

      <div className={isExport 
    ? `${classes.col2} ${classes.colRound2} ${classes.orderR1}` 
    : `${classes.col} ${classes.colRound}   ${classes.orderR1}`
  }>
        <Match
          id={r16_5?.id}
          basePath={basePath}
          status={r16_5?.status}
          date={formatDate(r16_5?.date)}
          time={r16_5?.time}
          city={r16_5?.city}
          roundTitle="Osmina finala"
          top={teamRow(r16_5?.home, r16_5?.homeScore, r16_5?.status)}
          bottom={teamRow(r16_5?.away, r16_5?.awayScore, r16_5?.status)}
          classes={classes}
          isExport={isExport}
        />

        <Match
          id={r16_6?.id}
          basePath={basePath}
          status={r16_7?.status}
          date={formatDate(r16_6?.date)}
          time={r16_6?.time}
          city={r16_6?.city}
          top={teamRow(r16_6?.home, r16_6?.homeScore, r16_6?.status)}
          bottom={teamRow(r16_6?.away, r16_6?.awayScore, r16_6?.status)}
          classes={classes}
          isExport={isExport}
        />

        <Match
          id={r16_7?.id}
          basePath={basePath}
          status={r16_7?.status}
          date={formatDate(r16_7?.date)}
          time={r16_7?.time}
          city={r16_7?.city}
          top={teamRow(r16_7?.home, r16_7?.homeScore, r16_7?.status)}
          bottom={teamRow(r16_7?.away, r16_7?.awayScore, r16_7?.status)}
          classes={classes}
          isExport={isExport}
        />

        <Match
          id={r16_8?.id}
          basePath={basePath}
          status={r16_8?.status}
          date={formatDate(r16_8?.date)}
          time={r16_8?.time}
          city={r16_8?.city}
          top={teamRow(r16_8?.home, r16_8?.homeScore, r16_8?.status)}
          bottom={teamRow(r16_8?.away, r16_8?.awayScore, r16_8?.status)}
          classes={classes}
          isExport={isExport}
        />
      </div>
       </div>  
      
    </div>
  );
}
