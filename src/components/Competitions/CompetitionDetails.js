// components/Competitions/CompetitionDetails.js
"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import classes from "@/components/Competitions/League.module.css";

import Bracket4 from "@/components/Brackets/viewer/Bracket4";
import Bracket8 from "@/components/Brackets/viewer/Bracket8";
import Bracket16 from "@/components/Brackets/viewer/Bracket16";
import PrijavniObrazec from "@/components/Competitions/PrijavniObrazec";
import KonecPrijav from "@/components/Competitions/KonecPrijav";
import MestaZapolnjena from "@/components/Competitions/MestaZapolnjena";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import LeagueRound from "./LeagueMatchRow";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import LeagueView from "./LeagueView";
import LoadingSpinner from "@/components/LoadingSpinner"; // <-- 1. UVOZ KOMPONENTE



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
  
  // URL logika za ohranjanje zavihka med izvozom (če ni parametra, je privzeto "league")
  const searchParams = useSearchParams();
  const activeView = searchParams.get("tab") || "league";

  const isEdit = isEditMode || pathName.endsWith("/edit");
  const bracketLink = isEdit ? `/Competitions/${id}` : `/Competitions/${id}/edit`;
  const aktivnePrijaveCount = applications.filter(a => a.status !== "zavrnjeno").length;

  const maxMest = comp?.maxTeams || 0;
  const trenutnoPrijavljenih = applications.length;

  const isFull = aktivnePrijaveCount >= maxMest;
  const prostaMesta = Math.max(0, maxMest - aktivnePrijaveCount);



  // Preverjanje pogojev za polfinale
  const ligaskeTekme = matches.filter(m => typeof m.round === 'number');
  const vseKoncane = ligaskeTekme.length > 0 && ligaskeTekme.every(m => m.status === "Končana");

  
    // 2. Izračun lestvice
    const lestvicaSorted = useMemo(() => {
      const table = teams.map(t => ({ 
        team: t, P: 0, PTS: 0, W: 0, D: 0, L: 0, GD: 0 
      }));
  
      matches.forEach((match) => {
        if (typeof match.round !== 'number' && isNaN(Number(match.round))) return;
        if (match.status !== "Končana" || match.homeScore === null || match.awayScore === null) return;
        
        const homeName = match.homeTeam ?? match.home;
        const awayName = match.awayTeam ?? match.away;
        
        let home = table.find((t) => t.team.name === homeName);
        let away = table.find((t) => t.team.name === awayName);
  
        if (!home || !away) return;
  
        home.P += 1; 
        away.P += 1;
        const hScore = Number(match.homeScore);
        const aScore = Number(match.awayScore);
  
        if (hScore > aScore) { 
          home.PTS += 3;
          home.W += 1; 
          away.L += 1; 
        }
        else if (hScore < aScore) { 
          away.PTS += 3;
          away.W += 1; 
          home.L += 1; 
        }
        else { 
          home.PTS += 1;
          away.PTS += 1; 
          home.D += 1; 
          away.D += 1; 
        }
        home.GD += (hScore - aScore);
        away.GD += (aScore - hScore);
      });
  
      return [...table].sort((a, b) => b.PTS - a.PTS || b.GD - a.GD);
    }, [matches, teams]);

    const top4 = lestvicaSorted.slice(0, 4);


  // 1. POSLUŠALCI (useEffect - prinašanje podatkov)
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
      if (vseKoncane && top4.length === 4) {
        const sf1Match = matches.find(m => m.round === "SF1");
        const sf2Match = matches.find(m => m.round === "SF2");

        if (sf1Match && sf2Match) {
          const potrebujeUpdate = sf1Match.home !== top4[0].team.name || sf2Match.home !== top4[1].team.name;

          if (potrebujeUpdate) {
            console.log("Pišem polfinaliste v bazo...");
            try {
              await updateDoc(doc(db, "competitions", id, "matches", sf1Match.id), {
                home: top4[0].team.name,
                away: top4[3].team.name
              });

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

  // Generiranje tekem za Bracket (Hibridni prehod)
  const prikazaneTekme = matches.map((m) => {
    if (vseKoncane && top4.length === 4) {
      if (m.round === "SF1") return { ...m, home: top4[0].team.name, away: top4[3].team.name };
      if (m.round === "SF2") return { ...m, home: top4[1].team.name, away: top4[2].team.name };
    }
    return m;
  });

    if (loading) return <LoadingSpinner />;
  

  const isLeague = comp?.mode === "ligaski";
  const isHybrid = comp?.mode === "hybrid";
  const mode = comp.publishMode;
  const showForm = mode === "FORM_ONLY" && !isFull;
  const showSchedule = mode === "SCHEDULE_ONLY";
  const mestaZapolnjena = mode === "FORM_ONLY" && isFull;
  const isBracket = showSchedule && !isLeague && matches.length > 0;

  const today = new Date().setHours(0, 0, 0, 0);
  const deadLine = comp?.registrationDeadline ? new Date(comp.registrationDeadline).setHours(0, 0, 0, 0) : null;
  const konecPrijav = deadLine ? deadLine < today : false;

  let Bracket = Bracket4;
  if (teamCount === 8) Bracket = Bracket8;
  if (teamCount === 16) Bracket = Bracket16;

  let ExportBracket = Bracket4;
  if (teamCount === 8) ExportBracket = Bracket8;
  if (teamCount === 16) ExportBracket = Bracket16;

  // --- LOGIKA ZA SCREENSHOT EXPORT ---
  if (isExport) {
    const exportujLigo = isLeague || (isHybrid && activeView === "league");
    const exportujBracket = !isLeague && (!isHybrid || activeView === "bracket");

    return (
      <div style={{ background: '#1e293b', padding: '20px'}}>
        {/* Izvozimo SAMO tisto, kar je bilo aktivno na zaslonu */}
        {exportujLigo && (
          <LeagueView matches={matches} teams={teams} id={id} isExport={true} />
        )}

        {exportujBracket && (
          <ExportBracket matches={prikazaneTekme} isExport={true} style={{marginTop: '150px'}} />
        )}
      </div>
    );
  }

  

  return (
    <div className={classes.page}>
      <div className={`${isBracket ? classes.bracketCard : classes.card}`}>
        
        {/* 1. DEL: Logika za prijave */}
        {!showSchedule && (
          <>
            {mestaZapolnjena && <MestaZapolnjena />}
            {konecPrijav && <KonecPrijav />}
            {showForm && (
              <PrijavniObrazec competition={comp} onSuccess={() => {}} />
            )}
          </>
        )}

        {/* 2. DEL: Razpored & Rezultati */}
        {showSchedule && (
          <section>
            
            {/* Navigacijski gumbi za preklop med ligo in bracketom (samo za hibrid, ko je konec lige) */}
            {isHybrid && vseKoncane && (
              <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', marginTop: '20px', justifyContent: 'center' }}>
                <button 
                  onClick={() => router.push(`${pathName}?tab=league`, { scroll: false })}
                  className={classes.smallBtn}
                  style={{ backgroundColor: activeView === "league" ? "#cbd5e1" : "#ffffff" }}
                >
                  Redni del
                </button>
                <button 
                  onClick={() => router.push(`${pathName}?tab=bracket`, { scroll: false })}
                  className={classes.smallBtn}
                  style={{ backgroundColor: activeView === "bracket" ? "#cbd5e1" : "#ffffff" }}
                >
                  Zaključni turnir
                </button>
              </div>
            )}

            <div style={{ marginTop: "1rem" }}>
              {/* Prikaz ligaškega dela */}
              {(isLeague || (isHybrid && activeView === "league")) && (
                <LeagueView matches={matches} teams={teams} id={id} />
              )}

              {/* Prikaz izločilnega dela */}
              {(!isLeague && (!isHybrid || activeView === "bracket")) && (
                <div style={{ marginTop: '2rem' }}>
                  <Bracket matches={prikazaneTekme} basePath={bracketLink} />
                </div>
              )}
            </div>
          </section>
        )}
        
      </div>
    </div>
  );
}