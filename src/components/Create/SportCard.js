"use client";

import Image from "next/image";
import classes from "./SportCard.module.css";
import { sports } from "@/data/Sports";

export default function SportCard({ sport, onSelect, active }) {
  const s = sports[sport];

  return (
    <button
      type="button"
      className={`${classes.card} ${active ? classes.active : ""}`}
      onClick={() => onSelect(sport)}
    >
      <div className={classes.imageWrap}>
        <Image
          src={s.image}
          alt={s.naslov}
          fill
          className={classes.image}
        />

        <div className={classes.overlay}>
          <h3 className={classes.naslov}>{s.naslov}</h3>
        </div>
      </div>
    </button>
  );
}
