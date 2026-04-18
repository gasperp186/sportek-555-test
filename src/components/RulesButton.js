"use client";

import { useState } from "react";
import classes from "./Ostalo.module.css"

export default function RulesToggle({ rules }) {
  const [showRules, setShowRules] = useState(false);

  return (
    <> {/* Fragment prepreči, da bi div vplival na flexbox v staršu */}
      <button 
        onClick={() => setShowRules(!showRules)} 
        className={classes.rulesButton}
      >
        {showRules ? "Skrij pravila" : "Prikaži pravila tekmovanja"}
      </button>

      {showRules && (
        <div className={classes.rulesKvadrat}>
          <h4 className={classes.rulesNaslov}>Pravila tekmovanja</h4>
          <p className={classes.rulesText}>{rules || "Pravila za to tekmovanje še niso določena."}</p>
        </div>
      )}
    </>
  );
}