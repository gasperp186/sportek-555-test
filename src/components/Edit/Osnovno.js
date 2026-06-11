"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { competitions as data } from "@/data/Competitions";
import classes from "./Osnovno.module.css";

export default function Osnovno({data, onChange}) {

  // Helper funkcija
const toInputDate = (dateStr) => {
  if (!dateStr) return '';
  
  // Če je že v YYYY-MM-DD formatu
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    return dateStr.slice(0, 10);
  }
  
  // Če je v DD.MM.YYYY formatu
  if (/^\d{2}\.\d{2}\.\d{4}/.test(dateStr)) {
    const [day, month, year] = dateStr.split('.');
    return `${year}-${month}-${day}`;
  }
  
  // Če je ISO string ali Date objekt
  return new Date(dateStr).toISOString().slice(0, 10);
};




  return (
    <div className={classes.wrapper}>
      <h2 className={classes.title}>Osnovno</h2>

      <div className={classes.field}>
        <label>Ime turnirja</label>
        <input
          name="title"
          type="text"
          value={data.title}
          onChange={onChange}
        />
      </div>

      {data.season ? (
        
      <div className={classes.row}>
        <div className={classes.field}>
          <label>Sezona</label>
          <input
            type="text"
            name="season"
            value={data.season}
            onChange={onChange}
          />
        </div>
        </div>
      ) 
       :
        (
<div className={classes.row}>
        <div className={classes.field}>
          <label>Datum od</label>
          <input
            type="date"
            name="startDate"
            value={toInputDate(data.startDate)}
            onChange={onChange}
          />
        </div>

        <div className={classes.field}>
         <label>Datum do</label>
          <input
            type="date"
            name="endDate"
            value={toInputDate(data.endDate)}
            onChange={onChange}
          />
        </div>
      </div>
        )
      }

      

      <div className={classes.row}>
        <div className={classes.field}>
          <label>Kraj</label>
          <input
            name="city"
            type="text"
            value={data.city}
            onChange={onChange}
          />
        </div>

        <div className={classes.field}>
          <label>Prizorišče</label>
          <input
            name="venue"
            type="text"
            value={data.venue}
            onChange={onChange}
          />
        </div>
      </div>

      <div className={classes.field}>
        <label>Pravila</label>
        <textarea
          name="rules"
          type="text"
          value={data.rulesText}
          onChange={onChange}
          rows={6}
        />
      </div>
    </div>
  );
}
