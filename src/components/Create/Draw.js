"use client";

import { useCallback } from "react";
import drawClasses from "./Draw.module.css";
import createClasses from "./Create.module.css";

import Bracket4 from "@/components/Brackets/Bracket4";
import Bracket8 from "@/components/Brackets/Bracket8";
import Bracket16 from "@/components/Brackets/Bracket16";
import LeagueDraw from "./LeagueDraw";

// 1. ZEMLJEVID KOMPONENT (Definirano ZUNAJ renderja)
const BRACKET_MAP = {
  4: Bracket4,
  8: Bracket8,
  16: Bracket16
};

export default function Draw({ form, setForm, onBack, onNext }) {
  const teams = form.teams || [];
  const size = teams.length;

  // 2. IZBIRA KOMPONENTE (Samo referenca, ne nova komponenta!)
  // Če število ekip ni točno 4, 8 ali 16, vzamemo najbližjo manjšo ali Bracket4
  const SelectedBracket = BRACKET_MAP[size];

  const setMatches = useCallback((matches) => {
    setForm((prev) => ({ ...prev, matches }));
  }, [setForm]);

  const handleHybridChange = useCallback((newMatches) => {
    if (!newMatches || newMatches.length === 0) return;
    setForm((prev) => {
      const currentMatches = prev.matches || [];
      const newPhase = newMatches[0].phase || "league";
      const otherMatches = currentMatches.filter((m) => (m.phase || "league") !== newPhase);
      return { ...prev, matches: [...otherMatches, ...newMatches] };
    });
  }, [setForm]);

  let mode = "";
  switch (form.mode) {
    case "ligaski": mode = "LIGA"; break;
    case "knockout": mode = "KNOCKOUT"; break;
    case "hybrid": mode = "HYBRID"; break;
  }

  // --- RENDERS ---

  if (mode === "LIGA") {
    return (
      <div className={createClasses.page}>
        <div className={drawClasses.card}>
          <h1 className={createClasses.naslov}>Ligaški žreb</h1>
          <LeagueDraw teams={teams} onChangeMatches={setMatches} isHybrid={false} />
          <div className={createClasses.actions}>
            <button onClick={onBack} className={createClasses.btnOutline}>Nazaj</button>
            <button onClick={onNext} className={createClasses.btn}>Naprej</button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "KNOCKOUT") {
    return (
      <div className={createClasses.page}>
        <div className={drawClasses.card}>
          <h1 className={createClasses.naslov}>Žreb (knockout)</h1>
          <div className={drawClasses.bracketWide}>
            {/* TUKAJ uporabimo SelectedBracket, ki je varna referenca */}
            <SelectedBracket teams={teams} matches={form.matches} onChangeMatches={setMatches} isHybrid={false} thirdPlaceMatch={form.thirdPlaceMatch}/>
          </div>
          <div className={createClasses.actions}>
            <button onClick={onBack} className={createClasses.btnOutline}>Nazaj</button>
            <button onClick={onNext} className={createClasses.btn}>Naprej</button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "HYBRID") {
    return (
      <div className={createClasses.page}>
        <div className={drawClasses.card}>
          <h1 className={createClasses.naslov}>Hibridni žreb</h1>
          
          <div className={drawClasses.section}>
            <h3>1. del: Skupinska faza</h3>
            <LeagueDraw teams={teams} onChangeMatches={handleHybridChange} isHybrid={true} />
          </div>

          <hr style={{ margin: "30px 0", border: "1px solid #eee" }} />

          <div className={drawClasses.section}>
            <h3>2. del: Zaključni boji</h3>
            <div className={drawClasses.bracketWide}>
              {/* ISTA varna referenca */}
              <SelectedBracket teams={teams} matches={form.matches} onChangeMatches={handleHybridChange} isHybrid={true} />
            </div>
          </div>

          <div className={createClasses.actions}>
            <button onClick={onBack} className={createClasses.btnOutline}>Nazaj</button>
            <button onClick={onNext} className={createClasses.btn}>Naprej</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}