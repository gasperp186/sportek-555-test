"use client";

import { useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { Camera } from 'lucide-react';
import { ClassNames } from '@emotion/react';
import classes from './Id.module.css';

import { formatDate }  from "@/components/formatDate";

export default function ScreenshotButton({ comp, contentToExport, width = "", height = ""}) {
  const ref = useRef(null);

  const shraniPng = useCallback(() => {
    if (ref.current === null) return;

  toPng(ref.current, { 
    cacheBust: true,
    pixelRatio: 2,
    backgroundColor: '#1e293b', // <--- To MORA biti tukaj
    width: parseInt(width),     
    height: parseInt(height),
    style: {
      margin: '0',
      padding: '0',
      backgroundColor: '#1e293b', // Prisili ozadje še tukaj
    }
  })
    .then((dataUrl) => {
      const link = document.createElement('a');
      link.download = `${comp.title}.png`;
      link.href = dataUrl;
      link.click();
    })
    .catch((err) => console.error("Napaka pri slikanju:", err));
  }, [ref, comp, width, height]);

  return (
  <>
    <button onClick={shraniPng} className={classes.screenshotButton}>
      <Camera size={22} />
    </button>

   {/* Krovni skriti div, ki mu dodamo barvo ozadja celotnega plakata */}
<div style={{ position: 'absolute', left: '-9999px', top: '0', backgroundColor: '#1e293b' }}>
  <div 
    ref={ref} 
    style={{ 
      width: width, 
      height: height, 
      margin: '0',
      padding: '40px 0', 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxSizing: 'border-box',
      backgroundColor: '#1e293b' 
    }}
  >
    <h2 className={classes.naslov}>{comp.title}</h2>
    <h3 className={classes.podnaslov}>
      {comp.mode === "bracket" || comp.mode === "knockout" ? (
        <>
          <strong>Datum:</strong> {
            !comp.endDate || comp.startDate === comp.endDate 
              ? formatDate(comp.startDate) 
              : `${formatDate(comp.startDate)} - ${formatDate(comp.endDate)}`
          }
        </>
      ) : (
        <>
          <strong>Sezona:</strong> {comp.season}
        </>
      )}
    </h3>
    <h3 className={classes.podnaslov2}>{comp.city}</h3>
    
    {/* POPRAVEK: Ta div zdaj prisili vsebino, da se raztegne na točno želeno širino */}
    <div style={{ 
      width: '100%', 
      display: 'flex', 
      justifyContent: 'center',
      /* Če je liga, potisnemo vsebino bolj gor (manjši margin-top), če je bracket pa nižje */
      marginTop: (comp.mode === "ligaski" || comp.mode === "hybrid") ? '0px' : '100px'
    }}>
      {contentToExport}
    </div>
    
  </div>
</div>
  </>
);
}