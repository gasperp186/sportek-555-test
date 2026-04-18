"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { competitions as data } from "@/data/Competitions";
import classes from "./Osnovno.module.css";

export default function Osnovno({data, onChange}) {




  return (
    <div className={classes.wrapper}>
      <h3 className={classes.title}>Osnovno</h3>

      <div className={classes.field}>
        <label>Ime turnirja</label>
        <input
          name="title"
          type="text"
          value={data.title}
          onChange={onChange}
        />
      </div>

      <div className={classes.row}>
        <div className={classes.field}>
          <label>Datum od</label>
          <input
            type="date"
            name="dateFrom"
            value={data.dateFrom}
            onChange={onChange}
          />
        </div>

        <div className={classes.field}>
         
        </div>
      </div>

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
