"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import classes from "./Competitions.module.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { formatDate } from "@/components/formatDate";

const sportBackgrounds = {
  nogomet: "/images/sports/nogomet.jpg",
  kosarka: "/images/sports/kosarka.jpg",
  odbojka: "/images/sports/odbojka.jpg",
  pikado: "/images/sports/pikado.jpg",
  "namizni nogomet": "/images/sports/namizniNogomet.jpg",
  biljard: "/images/sports/biljard.jpg",
  "namizni tenis": "/images/sports/namizniTenis.jpg",
};

const fallbackBg = "/images/sports/football.jpg"; // Odstranjen /public/, Next.js ga ne potrebuje v poti

function normalize(str) {
  return (str || "").toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

export default function CompetitionsPublic() {
  const [competitions, setCompetitions] = useState([]);
  const [q, setQ] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedcity, setSelectedcity] = useState("");
  const [timeFilter, setTimeFilter] = useState("all"); // 'all', 'today', 'upcoming', 'past'

  useEffect(() => {

    async function fetchMyData() {
      const snapshot = await getDocs(collection(db, "competitions"));

      const competitionsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Razvrstimo v 3 kategorije
      const todayComps = [];
      const upcomingComps = [];
      const pastComps = [];

      competitionsData.forEach(c => {
        const compDate = new Date(c.startDate);
        compDate.setHours(0, 0, 0, 0);

        if (compDate.getTime() === today.getTime()) {
          todayComps.push(c);
        } else if (compDate.getTime() > today.getTime()) {
          upcomingComps.push(c);
        } else {
          pastComps.push(c);
        }
      });

      // Znotraj vsake kategorije še dodatno sortiramo (npr. prihodnje od najbližje do najbolj oddaljene)
      todayComps.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
      upcomingComps.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
      pastComps.sort((a, b) => new Date(b.startDate) - new Date(a.startDate)); // Pretekle od najnovejše nazaj

      // Združimo: Danes -> Prihodnje -> Pretekle
      setCompetitions([...todayComps, ...upcomingComps, ...pastComps]);
    }
    fetchMyData();
  }, []);

  const sportOptions = useMemo(() => {
    const set = new Set(competitions.map((c) => c.sport).filter(Boolean));
    return Array.from(set).sort();
  }, [competitions]);

  const cityOptions = useMemo(() => {
    const set = new Set(competitions.map((c) => c.city).filter(Boolean));
    return Array.from(set).sort();
  }, [competitions]);

  const filtered = useMemo(() => {
    const query = normalize(q);
    const tokens = query ? query.split(" ").filter(Boolean) : [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return competitions.filter((c) => {
      const bySport = !selectedSport || c.sport === selectedSport;
      const bycity = !selectedcity || c.city === selectedcity;
      
      // FILTRIRANJE PO ČASU
      const compDate = new Date(c.startDate);
      compDate.setHours(0, 0, 0, 0);
      
      let byTime = true;
      if (timeFilter === "today") byTime = compDate.getTime() === today.getTime();
      if (timeFilter === "upcoming") byTime = compDate.getTime() >= today.getTime();
      if (timeFilter === "past") byTime = compDate.getTime() < today.getTime();

      if (!bySport || !bycity || !byTime) return false;

      if (tokens.length === 0) return true;

      const title = normalize(c.title);
      return tokens.every((t) => title.includes(t) || normalize(c.sport).includes(t) || normalize(c.city).includes(t));
    });
  }, [q, competitions, selectedSport, selectedcity, timeFilter]);

  function resetFilters() {
    setQ("");
    setSelectedSport("");
    setSelectedcity("");
    setTimeFilter("all");
  }

  return (
    <div className={classes.page}>
      <div className={classes.card}>
        <h2 className={classes.title}>Tekmovanja</h2>

        <div className={classes.filters}>
          {/* Išči */}
          <div className={classes.filterBlock}>
            <label className={classes.label}>Išči</label>
            <input className={classes.input} placeholder="Išči..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>

          {/* Šport */}
          <div className={classes.filterBlock}>
            <label className={classes.label}>Šport</label>
            <select className={classes.select} value={selectedSport} onChange={(e) => setSelectedSport(e.target.value)}>
              <option value="">Vsi</option>
              {sportOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Časovno obdobje - NOVO */}
          <div className={classes.filterBlock}>
            <label className={classes.label}>Obdobje</label>
            <select className={classes.select} value={timeFilter} onChange={(e) => setTimeFilter(e.target.value)}>
              <option value="all">Vse</option>
              <option value="today">Danes</option>
              <option value="upcoming">Prihajajoči</option>
              <option value="past">Pretekli</option>
            </select>
          </div>

          <button type="button" className={classes.reset} onClick={resetFilters}>Počisti</button>
        </div>

        {/* Mreža tekmovanj ostane podobna... */}
        {filtered.length === 0 ? (
          <p className={classes.empty}>Ni najdenih tekmovanj.</p>
        ) : (
          <div className={classes.grid}>
            {filtered.map((c) => {
              const sportKey = normalize(c.sport);
              const bg = sportBackgrounds[sportKey] || fallbackBg;
              return (
                <div key={c.id} className={classes.item} style={{ backgroundImage: `url(${bg})` }}>
                  <div className={classes.overlay}>
                    <h3 className={classes.itemTitle}>{c.title}</h3>
                    <p className={classes.itemInfo}>
                      <strong>Šport:</strong> {c.sport} <br />
                      <strong>Kraj:</strong> {c.city} <br />
                      <strong>Datum:</strong> { !c.endDate || c.startDate === c.endDate ? formatDate(c.startDate) : `${formatDate(c.startDate)} - ${formatDate(c.endDate)}` }
                    </p>
                    <Link href={`/Competitions/${c.id}`} className={classes.btn}>Odpri</Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}