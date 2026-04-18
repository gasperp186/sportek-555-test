"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import classes from "./MatchCard.module.css";
import Slot from "./Slot";

import {
  toDateOrNull,
  toTimeDateOrNull,
  formatYMD,
  formatHM,
} from "@/lib/DateTime";



export default function MatchCard({
  match,
  setWhen,
  homeValue,
  awayValue,
  setHome,
  setAway,
  freeHome,
  freeAway,
  isHybrid
}) {
  
  

  const selectedDate = toDateOrNull(match?.date);
  const selectedTime = toTimeDateOrNull(match?.time);

  return (
    <div className={classes.card}>
      <h4 className={classes.title}>{match?.label}</h4>

      <div className={classes.teamsRow}>

        {isHybrid ? (
          <select className={classes.okvir}><option value={homeValue}>{homeValue}</option></select>
        ) : (

           <select className={classes.okvir} value={homeValue} onChange={(e) => setHome(e.target.value)}>
          <option value="" >Domači</option>
          {freeHome.map((t) => (
            <option key={t.name} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>

        )}
      

        <span className={classes.vs}>vs</span>

        {isHybrid ? (
          <select className={classes.okvir}><option value={awayValue}>{awayValue}</option></select>
        ) : (<select className={classes.okvir} value={awayValue} onChange={(e) => setAway(e.target.value)}>
          <option value="">Gostje</option>
          {freeAway.map((t) => (
            <option key={t.name} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>)
}
         
      </div>

      <div className={classes.metaRow}>
  <div className={classes.datetimeBlock}>
    <span className={classes.metaLabel}>Datum</span>
   <DatePicker
  selected={selectedDate}
onChange={(d) => setWhen?.(match?.id, "date", d ? formatYMD(d) : "")}
  dateFormat="dd.MM.yyyy"
  placeholderText="Datum"
  className={classes.dpInput}
/>
  </div>

  <div className={classes.datetimeBlock}>
    <span className={classes.metaLabel}>Ura</span>
    <DatePicker
  selected={selectedTime}
  onChange={(d) => setWhen?.(match?.id, "time", d ? formatHM(d) : "")}
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
}

  