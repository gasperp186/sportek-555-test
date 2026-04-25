"use client";

import sportClasses from "./Sport.module.css";
import createClasses from "./Create.module.css";

import SportCard from "./SportCard";

export default function StepSport({ setForm, onNext }) {
  const selectSport = (sport) => {
    setForm((p) => ({ ...p, sport }));
    onNext(); 
  };

  return (
    <div className={createClasses.page}>
      <div className={sportClasses.card}>
        <h2 className={createClasses.naslov}>Izberi šport</h2>
        {/* <p className={createClasses.podnaslov}>
          Izberi za kateri šport bi ustvaril tekmovanje
        </p> */}

        

        <div className={sportClasses.container}>
          <SportCard sport="nogomet" onSelect={selectSport} />
          <SportCard sport="kosarka" onSelect={selectSport} />
          <SportCard sport="odbojka" onSelect={selectSport} />
          <SportCard sport="pikado" onSelect={selectSport} />
          <SportCard sport="futsal" onSelect={selectSport} />
          <SportCard sport="namizni tenis" onSelect={selectSport} />
          <SportCard sport="namizni nogomet" onSelect={selectSport} />
          <SportCard sport="biljard" onSelect={selectSport} />
        </div>
      </div>
    </div>
  );
}
