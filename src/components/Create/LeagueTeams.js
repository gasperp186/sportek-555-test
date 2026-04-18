"use client";

import { useEffect } from "react";
import classes from "./LeagueTeams.module.css";

// Nastavimo pravila


export default function LeagueTeams({ form, setForm, onValidChange }) {

  let MIN_EKIP = 3; 
  const MAX_EKIP = 10;

  if(form.mode === "hybrid") {
    MIN_EKIP = 4;
  }
  // Če teams še ne obstaja, vzamemo prazen seznam
  const teams = form.teams || [];

  // Preverjanje, če je vse izpolnjeno (Validacija)
  useEffect(() => {
    const aliJeVseIzpolnjeno = 
      teams.length >= MIN_EKIP && 
      teams.every(ekipa => ekipa.name.trim() !== "");

    onValidChange(aliJeVseIzpolnjeno);
  }, [teams, onValidChange]);

  // Funkcija za posodobitev imena
  const posodobiIme = (index, novoIme) => {
    const noveEkipe = [...teams];
    noveEkipe[index] = { name: novoIme };
    setForm({ ...form, teams: noveEkipe });
  };

  // Funkcija za dodajanje nove prazne ekipe
  const dodajEkipo = () => {
    if (teams.length < MAX_EKIP) {
      setForm({ ...form, teams: [...teams, { name: "" }] });
    }
  };

  // Funkcija za brisanje
  const izbrisiEkipo = (index) => {
    const filtriraneEkipe = teams.filter((_, i) => i !== index);
    setForm({ ...form, teams: filtriraneEkipe });
  };


  return (
    <>
      <h2 className={classes.naslov}>Vnos ekip</h2>
      <p className={classes.podnaslov}>Vnesi vsaj {MIN_EKIP} ekipe za začetek</p>

      <div className={classes.teamsList}>
        {teams.map((team, index) => (
          <div key={index} className={classes.teamRow}>
           <span className={classes.index}>{index + 1}</span>
            <input
              className={classes.teamInput}
              placeholder={`Ime ekipe ${index + 1}`}
              value={team.name}
              onChange={(e) => posodobiIme(index, e.target.value)}
            />
            
            {/* Gumb za brisanje pokažemo samo, če jih je več kot MIN */}
            {teams.length > MIN_EKIP && (
              <button className={classes.removeButton} onClick={() => izbrisiEkipo(index)}>
                ✕
              </button>
            )}

          
          </div>
        ))}
       
      </div>
      <div className={classes.dodajBtnDiv}>
           {teams.length < MAX_EKIP && (
        <button className={classes.dodajButton} onClick={dodajEkipo}>
          + Dodaj ekipo
        </button>
      )}
      </div>

      
    </>
  );
}