"use client";

import { useEffect } from "react";
import classes from "./LeagueTeams.module.css";

export default function LeagueTeams({ form, setForm, onValidChange }) {

  let MIN_EKIP = 3; 
  const MAX_EKIP = 8;

  if (form.mode === "hybrid") {
    MIN_EKIP = 4;

  }
  
  const teams = form.teams || [];

  // POPRAVLJENO: Odstranjen 'form' iz dependency array-a, da preprečimo neskončno zanko
  useEffect(() => {
    if (teams.length === 0) {
      const zacetneEkipe = Array.from({ length: MIN_EKIP }, () => ({ name: "" }));
      // Uporabimo funkcijsko posodobitev stanja, da ne rabimo celotnega 'form' objekta v odvisnostih
      setForm((prevForm) => ({ ...prevForm, teams: zacetneEkipe }));
    }
  }, [MIN_EKIP, setForm, teams.length]);

  // Preverjanje validacije
  useEffect(() => {
    const aliJeVseIzpolnjeno = 
      teams.length >= MIN_EKIP && 
      teams.every(ekipa => ekipa.name.trim() !== "");

    onValidChange(aliJeVseIzpolnjeno);
  }, [teams, onValidChange, MIN_EKIP]);

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
            
            {/* Gumb za brisanje pokažemo samo, če jih je trenutno več kot MIN_EKIP */}
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