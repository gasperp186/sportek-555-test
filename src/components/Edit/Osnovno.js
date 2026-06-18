"use client";

import { useMemo, useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { competitions as data } from "@/data/Competitions";
import classes from "./Osnovno.module.css";
import classes2 from "@/app/Competitions/[id]/edit/CompetitionEditPage.module.css";
import { db } from "@/lib/firebase";
import { getDoc, doc, updateDoc } from "firebase/firestore";

export default function Osnovno({data, onChange, onSave}) {

const { id } = useParams();

  const [comp, setComp] = useState(null);

  // Stanje za prikaz napisa o uspešnem shranjevanju
  const [showSuccess, setShowSuccess] = useState(false);

  // Samodejno skrij obvestilo po 3 sekundah
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // Helper funkcija
  const toInputDate = (dateStr) => {
    if (!dateStr) return '';
    
    // Če je že v YYYY-MM-DD formatu
    if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      return dateStr.slice(0, 10);
    }
    
    // Če je v DD.MM.YYYY formatu
    if (/^\d{2}\.\d{2}\.\d{4}/.test(dateStr)) {
      const [day, month, year] = dateStr.split('.');
      return `${year}-${month}-${day}`;
    }
    
    // Če je ISO string ali Date objekt
    return new Date(dateStr).toISOString().slice(0, 10);
  };

  // Funkcija, ki sproži onSave in nato prikaže obvestilo
  const handleSave = async () => {
    try {
      await onSave();
      setShowSuccess(true);
    } catch (error) {
      console.error("Napaka pri shranjevanju:", error);
    }
  };

  return (
    <div className={classes.wrapper}>
      <h2 className={classes.title}>Osnovno</h2>

      <div className={classes.field}>
        <label>Ime turnirja</label>
        <input
          name="title"
          type="text"
          value={data.title}
          onChange={onChange}
        />
      </div>

      {data.season ? (
        <div className={classes.row}>
          <div className={classes.field}>
            <label>Sezona</label>
            <input
              type="text"
              name="season"
              value={data.season}
              onChange={onChange}
            />
          </div>
        </div>
      ) : (
        <div className={classes.row}>
          <div className={classes.field}>
            <label>Datum od</label>
            <input
              type="date"
              name="startDate"
              value={toInputDate(data.startDate)}
              onChange={onChange}
            />
          </div>

          <div className={classes.field}>
            <label>Datum do</label>
            <input
              type="date"
              name="endDate"
              value={toInputDate(data.endDate)}
              onChange={onChange}
            />
          </div>
        </div>
      )}

      <div className={classes.row}>
        <div className={classes.field}>
          <label>Kraj</label>
          <input
            name="city"
            type="text"
            value={data.city}
            onChange={onChange}
          />
        </div>

        <div className={classes.field}>
          <label>Prizorišče</label>
          <input
            name="location"
            type="text"
            value={data.location}
            onChange={onChange}
          />
        </div>
      </div>

      <div className={classes.field}>
        <label>Pravila</label>
        <textarea
          name="rulesText"
          value={data.rulesText}
          onChange={onChange}
          rows={6}
        />
      </div>

      <div className={classes2.actions}>
        <button className={classes2.shraniButton} onClick={handleSave} type="button">Shrani</button>
        
       
      </div>
       {showSuccess && (
          <p style={{
            color: '#10b981', 
            fontSize: '14px', 
            fontWeight: '600', 
            width: '100%', 
            textAlign: 'center',
            marginTop: '10px',
            display: 'inline-block',
          }}>
            Spremembe uspešno shranjene
          </p>
        )}
    </div>
  );
}