"use client";

import stepClasses from "./Step.module.css";
import createClasses from "@/components/rules/Step.module.css";

import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { getAuth } from "firebase/auth";
import { useEffect } from "react";



const DEFAULT_RULES = {
  nogomet: `V nogometnem turnirju se ekipe pomerijo v dvobojih. Tekma traja 90 minut (2×45 min). Vsaka ekipa ima 11 igralcev. V primeru izenačenja v knockout fazi se igrajo podaljški ali kazenski streli.`,
  
  kosarka: `Igra se 4 četrtine po 10 minut. Vsaka ekipa ima na igrišču 5 igralcev. V primeru izenačenja se igrajo 5-minutni podaljški, dokler ne dobimo zmagovalca.`,
  
  odbojka: `Tekma se igra na tri dobljene sete do 25. točke. Morebitni peti set se igra do 15. točke. Ekipa šteje 6 igralcev na igrišču. Vsaka ekipa ima pravico do treh dotikov žoge.`,
  
  biljard: `Igra se po pravilih 'osmice' (8-ball) ali 'devetke' (9-ball). Zmaga tisti, ki prvi pospravi vse svoje krogline in na koncu črno kroglo (pri osmici). Upoštevajo se standardna pravila o prekrških in 'foul' udarcih.`,
  
  pikado: `Najpogostejša igra je 501 ali 301. Igralci izmenično metajo po tri puščice. Cilj je čim hitreje priti do ničle, pri čemer se mora zadnji met končati z zadetkom v 'double' polje.`,
  
  "namizni nogomet": `Igra se do doseženih 10 golov ali na dva dobljena niza do 5. Prepovedano je 'vrtenje' ročk (spinning). Ekipo sestavljata en ali dva igralca.`,
  
  "namizni tenis": `Tekma se igra na tri ali štiri dobljene sete. Posamezen set se igra do 11. točke. Servis se menja na vsaki dve točki. Pri rezultatu 10:10 se igra na dve točki razlike.`
};

export default function CompetitionRules({ form, setForm, onBack }) {


  const router = useRouter();

  useEffect(() => {
    
      const defaultText = DEFAULT_RULES[form.sport] || "";
      setForm(prev => ({ ...prev, rulesText: defaultText }));
    
  }, [form.sport, setForm]);

  
  // Definiramo rulesValue tukaj, da jo lahko uporabimo spodaj
const rulesValue = form.rulesText ?? DEFAULT_RULES[form.sport] ?? "";
  const handleFinalSubmit = async () => {

    const auth = getAuth();
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
        registrationDeadline: form.registrationDeadline,
        thirdPlaceMatch: form.thirdPlaceMatch,

      };

      if (form.mode === "ligaski" || form.mode === "hybrid") {
        competitionToSave.season = form.season || "";
        // Za vsak slučaj lahko tukaj eksplicitno nastaviš datume na null/prazno
        competitionToSave.startDate = "";
        competitionToSave.endDate = "";
      } else {
        competitionToSave.startDate = form.startDate || "";
        competitionToSave.endDate = form.endDate || "";
        // Pri knockoutu sezona ni potrebna
        competitionToSave.season = "";
      }

       


      // 1. Shranimo glavno tekmovanje
      const docRef = await addDoc(collection(db, "competitions"), competitionToSave);
      const compId = docRef.id;



      // 2. Shranimo ekipe
      for (const team of form.teams) {
        await addDoc(collection(db, "competitions", compId, "teams"), {
          name: team.name
        });
      }

      // 3. Shranimo tekme
      for (const match of form.matches) {
        const matchData = {
          home: match.home,
          away: match.away,
          date: match.date || "",
          time: match.time || "", 
          status: "scheduled",
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
    // Ligaški način
    matchData.round = match.round || 1;
    matchData.matchDay = match.round || 1;
    matchData.completed = false;
  }
        

        await addDoc(collection(db, "competitions", compId, "matches"), matchData);
      }

      alert("Tekmovanje uspešno ustvarjeno!");
      router.push("/Competitions");

    } catch (error) {
      console.error("Napaka pri shranjevanju:", error);
      alert("Prišlo je do napake pri shranjevanju.");
    }
  };

  return (
    <div className={createClasses.page}>
      <form className={stepClasses.card} onSubmit={(e) => e.preventDefault()}>
        <h2 className={createClasses.naslov}>Pravila tekmovanja</h2>
        <p className={createClasses.podnaslov}>Po potrebi uredi pravila tekmovanja.</p>

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

          <button type="button" className={createClasses.btn} onClick={handleFinalSubmit}>
            Ustvari tekmovanje
          </button>
        </div>
      </form>
    </div>
  );
}