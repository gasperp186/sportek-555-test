"use client";

import { useCallback, useState } from "react";
import drawClasses from "./Draw.module.css";
import createClasses from "./Create.module.css";

import Bracket4 from "@/components/Brackets/Bracket4";
import Bracket8 from "@/components/Brackets/Bracket8";
import Bracket16 from "@/components/Brackets/Bracket16";
import LeagueDraw from "./LeagueDraw";

const BRACKET_MAP = {
  4: Bracket4,
  8: Bracket8,
  16: Bracket16
};

export default function Draw({ form, setForm, onBack, onNext }) {
  const teams = form.teams || [];
  const size = teams.length;
  const matches = form.matches || [];

  // Stanje za shranjevanje napake
  const [error, setError] = useState(null);

  let mode = "";
  switch (form.mode) {
    case "ligaski": mode = "LIGA"; break;
    case "knockout": mode = "KNOCKOUT"; break;
    case "hybrid": mode = "HYBRID"; break;
  }

  // VAROVALKA: Če velikost ni 4, 8 ali 16 (npr. ko je na začetku 0), 
  // varno izberemo Bracket4, da React ne vrže napake "expected a string but got object"
  const SelectedBracket = mode === "HYBRID" 
    ? Bracket4 
    : (BRACKET_MAP[size] || Bracket4);

  const setMatches = useCallback((matches) => {
    setForm((prev) => ({ ...prev, matches }));
    setError(null); // Resetiramo napako ob novem žrebu
  }, [setForm]);

  // PAMETNO ZDRUŽEVANJE ZA HIBRID
  const handleHybridChange = useCallback((newMatches) => {
    if (!newMatches) return;
    
    setForm((prev) => {
      const currentMatches = prev.matches || [];
      if (newMatches.length === 0) return prev;

      const incomingPhase = newMatches[0].phase || "league";
      
      const otherMatches = currentMatches.filter(
        (m) => (m.phase || "league") !== incomingPhase
      );
      
      return { ...prev, matches: [...otherMatches, ...newMatches] };
    });
  }, [setForm]);

  // --- POPRAVLJENA VALIDACIJA: PREVERJA SAMO PRVI KROG ---
  const handleNextWithValidation = () => {
    if (mode === "KNOCKOUT") {
      // 1. Preverimo, če so tekme sploh generirane
      if (matches.length === 0) {
        setError("Prosim, izvedite žreb ekip pred nadaljevanjem!");
        return;
      }
      
      // 2. Preverimo, če so VSE trenutno vpisane ekipe že razporejene v žreb
      const allTeamsAssigned = teams.every(team => 
        matches.some(match => match.home === team.name || match.away === team.name)
      );

      if (!allTeamsAssigned) {
        setError("Vse prijavljene ekipe morajo biti razporejene v pare prvega kroga!");
        return;
      }
    }

    // Če gre vse skozi, počistimo napako in preusmerimo naprej
    setError(null);
    onNext();
  };

  // --- RENDERS ---

  if (mode === "LIGA") {
    return (
      <div className={createClasses.page}>
        <div className={drawClasses.card}>
          <h1 className={createClasses.naslov}>Žreb lige</h1>
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
          <h1 className={createClasses.naslov}>Žreb</h1>
          <div className={drawClasses.bracketWide}>
            <SelectedBracket 
              teams={teams} 
              matches={matches} 
              onChangeMatches={setMatches} 
              isHybrid={false} 
              thirdPlaceMatch={form.thirdPlaceMatch}
            />
          </div>
          
          <div className={createClasses.actions}>
            <button onClick={onBack} className={createClasses.btnOutline}>Nazaj</button>
            <button onClick={handleNextWithValidation} className={createClasses.btn}>Naprej</button>
          </div>

          {/* RDEČI NAPIS ZA NAPAKO */}
          {error && (
            <div style={{
              color: "#ef4444",
              fontSize: "14px",
              fontWeight: "600",
              textAlign: "center",
              marginTop: "12px"
            }}>
              {error}
            </div>
          )}
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
            <h3 className={drawClasses.podnaslov}>1. del: Skupinska faza</h3>
            <LeagueDraw teams={teams} onChangeMatches={handleHybridChange} isHybrid={true} />
          </div>

          <div className={drawClasses.section}>
            <h3 className={drawClasses.podnaslov2}>2. del: Zaključni boji</h3>
            <div className={drawClasses.bracketWide}>
              <SelectedBracket 
                teams={teams} 
                matches={matches} 
                onChangeMatches={handleHybridChange} 
                isHybrid={true} 
                thirdPlaceMatch={form.thirdPlaceMatch}
              />
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