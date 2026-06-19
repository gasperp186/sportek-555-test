"use client";

import { useState, useEffect } from "react";
import stepClasses from "./Step.module.css";
import createClasses from "@/components/rules/Step.module.css";

import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";

import LoadingSpinner from "@/components/LoadingSpinner"; 

const DEFAULT_RULES = {
  nogomet: `V nogometnem turnirju se ekipe pomerijo v dvobojih. Tekma traja 90 minut (2×45 min). Vsaka ekipa ima 11 igralcev. V primeru izenačenja v knockout fazi se igrajo podaljški ali kazenski streli.`,
  kosarka: `Igra se 4 četrtine po 10 minut. Vsaka ekipa ima na igrišču 5 igralcev. V primeru izenačenja se igrajo 5-minutni podaljški, dokler ne dobimo zmagovalca.`,
  odbojka: `Tekma se igra na tri dobljene sete do 25. točke. Morebitni peti set se igra do 15. točke. Ekipa šteje 6 igralcev na igrišču. Vsaka ekipa ima pravico do treh dotikov žoge.`,
  biljard: `Igra se po pravilih 'osmice' (8-ball) ali 'devetke' (9-ball). Zmaga tisti, ki prvi pospravi vse svoje krogline in na koncu črno kroglo (pri osmici). Upoštevajo se standardna pravila o prekrških in 'foul' udarcih.`,
  pikado: `Najpogostejša igra je 501 ali 301. Igralci izmenično metajo po tri puščice. Cilj je čim hitreje priti do ničle, pri čemer se mora zadnji met končati z zadetkom v 'double' polje.`,
  "namizni nogomet": `Igra se do doseženih 10 golov ali na dva dobljena niza do 5. Prepovedano je 'vrtenje' ročk (spinning). Ekipo sestavljata en ali dva igralca.`,
  "namizni tenis": `Tekma se igra na tri dobljene sete. Posamezen set se igra do 11. točke. Servis se menja na vsaki dve točki. Pri rezultatu 10:10 se igra na dve točki razlike.`,
  balinanje: `Tekma se igra 1h 15 min oziroma do 13 točk. V primeru neoodločenega izzida se odigra dodatni met dokler ne dobimo zmagovalca.`

};

export default function CompetitionRules({ form, setForm, onBack }) {
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const defaultText = DEFAULT_RULES[form.sport] || "";
    setForm(prev => ({ ...prev, rulesText: defaultText }));
  }, [form.sport, setForm]);

  const rulesValue = form.rulesText ?? DEFAULT_RULES[form.sport] ?? "";

  const handleFinalSubmit = async () => {
    if (isLoading) return;
    setIsLoading(true);

    const auth = getAuth();
    if (!auth.currentUser) {
      alert("Uporabnik ni prijavljen!");
      setIsLoading(false);
      return;
    }
    
    const userId = auth.currentUser.uid;

    try {
      const competitionToSave = {
        sport: form.sport,
        title: form.title,
        city: form.city,
        location: form.location || "",
        mode: form.mode,
        publicSignups: form.publicSignups,
        maxTeams: form.maxTeams,
        rulesText: form.rulesText || DEFAULT_RULES[form.sport] || "",
        createdAt: new Date(),
        createdBy: userId,
        editors: [],
        publishMode: form.publicSignups ? "FORM_ONLY" : "SCHEDULE_ONLY",
        registrationDeadline: form.registrationDeadline || "",
        thirdPlaceMatch: form.thirdPlaceMatch ?? false,
      };

      if (form.mode === "ligaski" || form.mode === "hybrid") {
        competitionToSave.season = form.season || "";
        competitionToSave.startDate = "";
        competitionToSave.endDate = "";
      } else {
        competitionToSave.startDate = form.startDate || "";
        competitionToSave.endDate = form.endDate || "";
        competitionToSave.season = "";
      }

      const docRef = await addDoc(collection(db, "competitions"), competitionToSave);
      const compId = docRef.id;

      if (form.teams && Array.isArray(form.teams)) {
        for (const team of form.teams) {
          await addDoc(collection(db, "competitions", compId, "teams"), {
            name: team.name
          });
        }
      }

      if (form.matches && Array.isArray(form.matches)) {
        for (const match of form.matches) {
          const matchData = {
            home: match.home,
            away: match.away,
            date: match.date || "",
            time: match.time || "", 
            status: "Načrtovana",
            homeScore: null,
            awayScore: null,
            city: form.city || "",
            location: form.location || ""
          };

          const tipTekme = typeof match.round;

          if (tipTekme === "string") {
            matchData.round = match.round || 1;
            matchData.winnerMatchId = match.winnerMatchId || null;
            matchData.loserMatchId = match.loserMatchId || null;
            matchData.nextPosition = match.nextPosition || null;
          } else {
            matchData.round = match.round || 1;
            matchData.matchDay = match.round || 1;
            matchData.completed = false;
          }

          await addDoc(collection(db, "competitions", compId, "matches"), matchData);
        }
      }

      setIsLoading(false);
      setIsSuccess(true);

      setTimeout(() => {
        router.push("/Competitions");
      }, 2000);

    } catch (error) {
      console.error("Napaka pri shranjevanju:", error);
      alert("Prišlo je do napake pri shranjevanju.");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className={createClasses.page}>
      <form className={stepClasses.card} onSubmit={(e) => e.preventDefault()}>
        
        {!isSuccess && <h2 className={createClasses.naslov}>Pravila tekmovanja</h2>}

        {isSuccess ? (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: '#10b981',
            fontSize: '18px',
            fontWeight: '600'
          }}>
            Tekmovanje je uspešno kreirano
          </div>
        ) : (
          <>
            <div className={stepClasses.control}>
              <textarea
                id="rulesText"
                className={stepClasses.textareaLight}
                rows={10}
                value={rulesValue}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    rulesText: e.target.value,
                  }))
                }
              />
            </div>

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
                onClick={handleFinalSubmit}
              >
                Ustvari tekmovanje
              </button>
            </div>
          </>
        )}
      </form>
    </div>
  );
}