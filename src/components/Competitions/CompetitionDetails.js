"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
// import s1 from "@/app/Competitions/Competitions.module.css";
import classes from "@/components/Competitions/League.module.css";

import Bracket4 from "@/components/Brackets/viewer/Bracket4";
import Bracket8 from "@/components/Brackets/viewer/Bracket8";
import Bracket16 from "@/components/Brackets/viewer/Bracket16";
import PrijavniObrazec from "@/components/Competitions/PrijavniObrazec";
import KonecPrijav from "@/components/Competitions/KonecPrijav";
import MestaZapolnjena from "@/components/Competitions/MestaZapolnjena";
import { useRouter, usePathname } from "next/navigation";
import LeagueRound from "./LeagueMatchRow";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import LeagueView from "./LeagueView";

export default function CompetitionDetails({ id, initialData, basePath = "", isEditMode = false, isExport = false }) {
  const [comp, setComp] = useState(initialData);
  const [matches, setMatches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teamCount, setTeamCount] = useState(0);
  const [applications, setApplications] = useState([]);
  const [selectedRound, setSelectedRound] = useState(1);
  const [editTab, setEditTab] = useState("tekme");

  const router = useRouter();
  const pathName = usePathname();
  const isEdit = isEditMode || pathName.endsWith("/edit");

  const bracketLink = isEdit ? `/Competitions/${id}` : `/Competitions/${id}/edit`;
  const aktivnePrijaveCount = applications.filter(a => a.status !== "zavrnjeno").length;

const maxMest = comp?.maxTeams || 0;
  const trenutnoPrijavljenih = applications.length;


  const isFull = aktivnePrijaveCount >= maxMest;
  const prostaMesta = Math.max(0, maxMest - aktivnePrijaveCount);

  const lestvica = teams.map((team) => ({
    team: team, P: 0, PTS: 0, W: 0, D: 0, L: 0, GD: 0,
  }));
  const lestvicaSorted = [...lestvica].sort((a, b) => b.PTS - a.PTS || b.GD - a.GD);

    const top4 = lestvicaSorted.slice(0, 4);

  // D) Preverjanje pogojev za polfinale
  const ligaskeTekme = matches.filter(m => typeof m.round === 'number');
  const vseKoncane = ligaskeTekme.length > 0 && ligaskeTekme.every(m => m.status === "finished");

  // 1. POSLUŠALCI (useEffect - samo prinašajo podatke)
  useEffect(() => {
    const unsubApps = onSnapshot(collection(db, "competitions", id, "applications"), (snap) => {
      setApplications(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubTeams = onSnapshot(collection(db, "competitions", id, "teams"), (snap) => {
      setTeams(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setTeamCount(snap.size);
    });

    const unsubMatches = onSnapshot(collection(db, "competitions", id, "matches"), (snap) => {
      setMatches(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    return () => {
      unsubApps();
      unsubTeams();
      unsubMatches();
    };
  }, [id]);

  useEffect(() => {
    
  const zapisiVBazo = async () => {
    // 1. Preverimo, če so vsi pogoji za konec lige izpolnjeni
    if (vseKoncane && top4.length === 4) {
      
      // 2. Poiščemo dokumente za SF1 in SF2 v tvojem seznamu matches
      const sf1Match = matches.find(m => m.round === "SF1");
      const sf2Match = matches.find(m => m.round === "SF2");

      if (sf1Match && sf2Match) {
        // 3. KLJUČNI POGOJ: Zapišemo v bazo SAMO, če tam še ni pravih imen.
        // To prepreči, da bi se tvoj Firebase račun "skuril" zaradi neskončnih zapisov.
        const potrebujeUpdate = sf1Match.home !== top4[0].team.name || sf2Match.home !== top4[1].team.name;

        if (potrebujeUpdate) {
          console.log("Pišem polfinaliste v bazo...");
          
          try {
            // Zapis za SF1 (1. vs 4.)
            await updateDoc(doc(db, "competitions", id, "matches", sf1Match.id), {
              home: top4[0].team.name,
              away: top4[3].team.name
            });

            // Zapis za SF2 (2. vs 3.)
            await updateDoc(doc(db, "competitions", id, "matches", sf2Match.id), {
              home: top4[1].team.name,
              away: top4[2].team.name
            });
            
            console.log("Baza uspešno posodobljena!");
          } catch (err) {
            console.error("Napaka pri zapisu v bazo:", err);
          }
        }
      }
    }
  };

  zapisiVBazo();
}, [vseKoncane, top4, matches, id]);

  // --- KUHINJA (IZRAČUNI) ---
  // Vse spodaj se izračuna ob vsakem renderju iz svežih podatkov.

  // A) Priprava prazne lestvice
  

  // B) Izračun statistike (Točke, goli...)
  

  // C) Sortiranje lestvice in Top 4
 

  // E) Generiranje tekem za Bracket (Hibridni prehod)
  const prikazaneTekme = matches.map((m) => {
    if (vseKoncane && top4.length === 4) {
      if (m.round === "SF1") return { ...m, home: top4[0].team.name, away: top4[3].team.name };
      if (m.round === "SF2") return { ...m, home: top4[1].team.name, away: top4[2].team.name };
    }
    return m;
  });

  // --- KONEC IZRAČUNOV ---

  if (loading) return <div className={classes.page}>Nalagam podatke...</div>;


  const isLeague = comp?.mode === "ligaski";
  const isHybrid = comp?.mode === "hybrid";
  const mode = comp.publishMode;
  const showForm = mode === "FORM_ONLY" && !isFull;
  const showSchedule = mode === "SCHEDULE_ONLY";
  const mestaZapolnjena = mode === "FORM_ONLY" && isFull;
  const isBracket = showSchedule && !isLeague && matches.length > 0;

  const today = new Date().setHours(0, 0, 0, 0); // Danes ob polnoči
  const deadLine = comp?.registrationDeadline 
  ? new Date(comp.registrationDeadline).setHours(0, 0, 0, 0) 
  : null;

  const konecPrijav = deadLine ? deadLine < today : false;
  
  const maxRound = ligaskeTekme.length > 0 ? Math.max(...ligaskeTekme.map(m => m.round)) : 1;
  const matchesThisRound = matches.filter((m) => m.round === selectedRound);

  let Bracket = Bracket4;
  if (teamCount === 8) Bracket = Bracket8;
  if (teamCount === 16) Bracket = Bracket16;


  let ExportBracket = Bracket4;
if (teamCount === 8) ExportBracket = Bracket8;
if (teamCount === 16) ExportBracket = Bracket16;

// 2. Če gumb ScreenshotButton zahteva export, vrnemo samo tole
if (isExport) {
  return (
    <div>
      {/* Tu zdaj uporabimo ExportBracket, ki smo ga zgoraj določili */}
      <ExportBracket matches={prikazaneTekme} isExport={true} />
    </div>
  );
}

  return (
    <div className={classes.page}>
      <div className={`${isBracket ? classes.bracketCard : classes.card}`}>
        {mestaZapolnjena && (
          <MestaZapolnjena /> 
          
        )}

        {konecPrijav && (
          <KonecPrijav />
        )}

        {showForm && (
          <PrijavniObrazec competition={comp} onSuccess={() => {}} />
        )}

        {showSchedule && (
          <section>
            <div style={{ marginTop: "1rem" }}>
              {(isHybrid || isLeague) && (
                  <LeagueView matches={matches} teams={teams} id={id} />              )}

              {isHybrid && <hr style={{margin: '2rem 0'}} />}

              {!isLeague && (
                <div style={{marginTop: '2rem'}}>
                  <Bracket matches={prikazaneTekme} basePath={bracketLink}/>
                </div>
              )}
            </div>
          </section>
        )}

        {/* <div className={classes.actions}>
          <button onClick={() => router.back()} className={classes.nazajButton}>Nazaj</button>
        </div> */}
      </div>
    </div>
  )
}