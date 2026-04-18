"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import classes from "./Competitions.module.css";

import { competitions as data } from "@/data/Competitions"; 
import { collection, getDocs } from "firebase/firestore";
import { useEffect } from "react";
import { db } from "@/lib/firebase";


const sportBackgrounds = {
  nogomet: "/images/sports/nogomet.jpg",
  kosarka: "/images/sports/kosarka.jpg",
  odbojka: "/images/sports/odbojka.jpg",
  pikado: "/images/sports/pikado.jpg",
  "namizni nogomet": "/images/sports/namizniNogomet.jpg",
  biljard: "/images/sports/biljard.jpg",
  "namizni tenis": "/images/sports/namizniTenis.jpg",
};

const fallbackBg = "/public/images/sports/football.jpg";

function normalize(str) {
  return (str || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export default function CompetitionsPublic() {
  const [competitions, setCompetitions] = useState([]);

  const [q, setQ] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedcity, setSelectedcity] = useState("");

  useEffect(() => {

    async function fetchMyData() {
      const snapshot = await getDocs(collection(db, "competitions"));

      const dataFromFirebase = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setCompetitions(dataFromFirebase);
}


      fetchMyData();
    


  }, []); //[], da se to izvede samo enkrat ob nalaganju strani

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

    return competitions.filter((c) => {
      const bySport = !selectedSport || c.sport === selectedSport;
      const bycity = !selectedcity || c.city === selectedcity;
      if (!bySport || !bycity) return false;

      if (tokens.length === 0) return true;

      const title = normalize(c.title);
      const sport = normalize(c.sport);
      const city = normalize(c.city);
      const dateText = normalize(c.date);

      return tokens.every((t) => {
        return (
          title.includes(t) ||
          sport.includes(t) ||
          city.includes(t) ||
          dateText.includes(t)
        );
      });
    });
  }, [q, competitions, selectedSport, selectedcity]);

  function resetFilters() {
    setQ("");
    setSelectedSport("");
    setSelectedcity("");
  }

  return (
    <div className={classes.page}>
      <div className={classes.card}>
        <h2 className={classes.title}>Tekmovanja</h2>
    

        <div className={classes.filters}>
          <div className={classes.filterBlock}>
            <label className={classes.label}>Išči</label>
            <input
              className={classes.input}
              placeholder="Išči..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <div className={classes.filterBlock}>
            <label className={classes.label}>Šport</label>
            <select
              className={classes.select}
              value={selectedSport}
              onChange={(e) => setSelectedSport(e.target.value)}
            >
              <option value="">Vsi</option>
              {sportOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className={classes.filterBlock}>
            <label className={classes.label}>Kraj</label>
            <select
              className={classes.select}
              value={selectedcity}
              onChange={(e) => setSelectedcity(e.target.value)}
            >
              <option value="">Vsi</option>
              {cityOptions.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <button type="button" className={classes.reset} onClick={resetFilters}>
            Počisti
          </button>
        </div>

        {filtered.length === 0 ? (
          <p className={classes.empty}>Ni najdenih tekmovanj.</p>
        ) : (
          <div className={classes.grid}>
            {filtered.map((c) => {
              const sportKey = normalize(c.sport);
              const bg = sportBackgrounds[sportKey] || fallbackBg;

              return (
                <div
                  key={c.id}
                  className={classes.item}
                  style={{ backgroundImage: `url(${bg})` }}
                >
                  <div className={classes.overlay}>
                    <h3 className={classes.itemTitle}>{c.title}</h3>
                    <p className={classes.itemInfo}>
                      <strong>Šport:</strong> {c.sport}
                      <br />
                      <strong>Kraj:</strong> {c.city}
                      <br />
                      <strong>Datum:</strong> {c.date}
                    </p>

                    <Link
                      href={`/Competitions/${c.id}`}

                      className={classes.btn}
                      onClick={() => {
                        if (typeof window !== "undefined") {
                          localStorage.setItem("last_competition", JSON.stringify(c));
                        }
                      }}
                    >
                      Odpri
                    </Link>
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
