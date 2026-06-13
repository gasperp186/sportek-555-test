"use client";
import { useState, useEffect } from "react";
import Calendar from "@/components/Calender/Calendar";
import LoadingSpinner from "@/components/LoadingSpinner"; // <-- 1. UVOZ NOVOGA OKENCA
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

// 1. Definirava barve za vsak šport
const sportColors = {
  nogomet: "#2ecc71",           // Zelena
  kosarka: "#e67e22",           // Oranžna
  odbojka: "#f1c40f",           // Rumena
  pikado: "#9b59b6",            // Vijolična
  rokomet: "#3498db",           // Modra
  tenis: "#badc58",             // Svetlo zelena
  "namizni nogomet": "#dcd858",
  default: "#95a5a6"            // Siva (če športa ne najde)
};

// Pomožna funkcija za čiščenje besedila
function normalizeSport(str) {
  return (str || "").toString().toLowerCase().trim();
}

export default function Page() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGroupedEvents() {
      try {
        setLoading(true);
        const compSnapshot = await getDocs(collection(db, "competitions"));
        
        let groupedEvents = [];

        for (const compDoc of compSnapshot.docs) {
          const tournamentData = compDoc.data();
          const tournamentId = compDoc.id;
          const tournamentTitle = tournamentData.title || "Turnir";
          
          // 2. Določiva barvo glede na šport tekmovanja
          const sportKey = normalizeSport(tournamentData.sport);
          const tournamentColor = sportColors[sportKey] || sportColors.default;
          
          const matchesSnapshot = await getDocs(collection(db, "competitions", tournamentId, "matches"));
          const unikatniDatumi = new Set();
          
          matchesSnapshot.forEach((matchDoc) => {
            if (matchDoc.data().date) {
              unikatniDatumi.add(matchDoc.data().date);
            }
          });

          unikatniDatumi.forEach((datum) => {
            groupedEvents.push({
              id: `${tournamentId}-${datum}`,
              title: tournamentTitle,
              start: datum,
              allDay: true,
              backgroundColor: tournamentColor,
              borderColor: tournamentColor,
              textColor: "#ffffff", 
              url: `/Competitions/${tournamentId}`, 
              extendedProps: {
                sport: tournamentData.sport
              }
            });
          });
        }

        setEvents(groupedEvents);
      } catch (error) {
        console.error("Napaka:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchGroupedEvents();
  }, []);

  // <-- 2. POPRAVEK: Namesto starega div-a vrnemo novo komponento
  if (loading) return <LoadingSpinner />;

  return (
    <Calendar key={events.length} events={events} />
  );
}