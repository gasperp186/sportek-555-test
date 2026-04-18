"use client";

import { useEffect } from "react";
import addClasses from "./AddTeams.module.css";
import createClasses from "./Create.module.css";


export default function KnockoutTeams({ form, setForm, onValidChange }) {
  const teamCount = form.knockoutTeamCount ?? 4;
  const teams = form.teams ?? [];

  useEffect(() => {
    let newTeams = [];

    for (let i = 0; i < teamCount; i++) {
      if (teams[i]) {                     // če ekipa obstaja jo prenesemo v newTeams da bo vidna če menjamo count npr. iz 4 na 8
        newTeams.push(teams[i]);   
      } else {
        newTeams.push({ name: "" });      // če ne pa samo normalno dodamo vneseno novo ime
      }
    }

    setForm({
      ...form,
      teams: newTeams,
    });
  }, [teamCount]);

  useEffect(() => {
    let valid = true;

    if (teams.length !== teamCount) {
      valid = false;
    }

    for (let i = 0; i < teams.length; i++) {
      if (!teams[i].name || teams[i].name.trim() === "") {
        valid = false;
      }
    }

    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
       
        const ime1 = teams[i].name.trim().toLowerCase();
        const ime2 = teams[j].name.trim().toLowerCase();

        if(ime1 !== "" && ime1 === ime2) {
          valid = false;
        }
        
      }
    }

    onValidChange(valid);
  }, [teams, teamCount]);

  function handleCountChange(value) {
    let number = Number(value);

    setForm({
      ...form,
      knockoutTeamCount: number,
    });
  }

  function handleNameChange(index, value) {
    let newTeams = [];

    for (let i = 0; i < teams.length; i++) {
      if (i === index) {
        newTeams.push({ name: value });
      } else {
        newTeams.push(teams[i]);
      }
    }

    setForm({
      ...form,
      teams: newTeams,
    });
  }

  let teamInputs = [];

for (let i = 0; i < teamCount; i++) {
  teamInputs.push(
    <div key={i} className={addClasses.control}>
      <label className={createClasses.label}>Ekipa {i + 1}</label>
      <input
        className={createClasses.input}
        value={teams[i]?.name ?? ""}
        onChange={(e) => handleNameChange(i, e.target.value)}
        placeholder={`Ime ekipe ${i + 1}`}
        autoComplete="off"
      />
    </div>
  );
}
  return (
    <>
      <h2 className={createClasses.naslov}>Dodaj ekipe (knockout)</h2>

      <div className={addClasses.control}>
        <label className={createClasses.label}>Število ekip</label>
        <select
          className={createClasses.select}
          value={teamCount}
          onChange={(e) => handleCountChange(e.target.value)}
        >
          <option value="4">4 ekipe</option>
          <option value="8">8 ekip</option>
          <option value="16">16 ekip</option>
        </select>
      </div>

      <div className={addClasses.teamsGrid}>
         {teamInputs}
      </div>

    </>
  );
}
