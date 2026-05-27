"use client";

import { useCallback } from "react";
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

  let mode = "";
  switch (form.mode) {
    case "ligaski": mode = "LIGA"; break;
    case "knockout": mode = "KNOCKOUT"; break;
    case "hybrid": mode = "HYBRID"; break;
  }

  const SelectedBracket = mode === "HYBRID" ? Bracket4 : (BRACKET_MAP[size] || Bracket4);

  // Navaden setMatches za čisto ligo in čisti knockout
  const setMatches = useCallback((matches) => {
    setForm((prev) => ({ ...prev, matches }));
  }, [setForm]);

  // PAMETNO ZDRUŽEVANJE ZA HIBRID: prepreči, da bi komponente povozile druga drugo
  const handleHybridChange = useCallback((newMatches) => {
    if (!newMatches) return;
    
    setForm((prev) => {
      const currentMatches = prev.matches || [];
      // Če pride prazno polje iz katere od komponent, ne brišemo vsega
      if (newMatches.length === 0) return prev;

      // Pogledamo phase prve tekme v prejetem seznamu (privzeto je "league")
      const incomingPhase = newMatches[0].phase || "league";
      
      // Obdržimo VSE tekme, ki NE pripadajo fazi, ki jo ravno posodabljamo
      const otherMatches = currentMatches.filter(
        (m) => (m.phase || "league") !== incomingPhase
      );
      
      // Združimo stare tekme druge faze z novimi tekmi te faze
      return { ...prev, matches: [...otherMatches, ...newMatches] };
    });
  }, [setForm]);

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
          <h1 className={createClasses.naslov}>Žreb knockout</h1>
          <div className={drawClasses.bracketWide}>
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
            <h3 className={drawClasses.podnaslov}>1. del: Skupinska faza</h3>
            {/* TUKAJ: Uporabimo handleHybridChange */}
            <LeagueDraw teams={teams} onChangeMatches={handleHybridChange} isHybrid={true} />
          </div>

          <div className={drawClasses.section}>
            <h3 className={drawClasses.podnaslov2}>2. del: Zaključni boji</h3>
            <div className={drawClasses.bracketWide}>
              {/* TUKAJ: Tudi Bracket4 uporablja handleHybridChange */}
              <SelectedBracket 
                teams={teams} 
                matches={form.matches || []} 
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