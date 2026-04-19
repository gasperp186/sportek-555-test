"use client";

import { useState } from "react";

import addClasses from "./AddTeams.module.css";
import createClasses from "./Create.module.css";

import KnockoutTeams from "./KnockoutTeams";
import LeagueTeams from "./LeagueTeams";

export default function AddTeams({ form, setForm, onBack, onNext }) {
  const [isValid, setIsValid] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  let tipTekmovanja = '';

  switch(form.mode) {
    case 'ligaski': tipTekmovanja = 'LIGA'; break;
    case 'knockout': tipTekmovanja = 'KNOCKOUT'; break;
    case 'hybrid': tipTekmovanja = 'HYBRID'; break;
  }
  

  function handleNext() {
    setSubmitted(true);
    if (!isValid) return;
    onNext();
  }

  return (
    <div className={createClasses.page}>
      <div className={addClasses.card}>
        {tipTekmovanja === "KNOCKOUT" && (
          <KnockoutTeams form={form} setForm={setForm} onValidChange={setIsValid} />
          

        )}

       {(tipTekmovanja === "LIGA" || tipTekmovanja === "HYBRID") && (
  <LeagueTeams form={form} setForm={setForm} onValidChange={setIsValid} />
)}

{submitted && !isValid && <p style={{color: 'red'}}>Vsa imena morajo biti izpolnjena in unikatna!</p>}

        <div className={createClasses.actions}>
          <button
            type="button"
            className={`${createClasses.btn} ${createClasses.btnOutline}`}
            onClick={onBack}
          >
            Nazaj
          </button>

          <button
            type="button"
            className={createClasses.btn}
            onClick={handleNext}
            
          >
            Naprej
          </button>
        </div>
      </div>
    </div>
  );
}
