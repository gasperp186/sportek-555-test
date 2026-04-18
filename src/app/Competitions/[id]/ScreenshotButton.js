"use client";

import { useRef, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { Camera } from 'lucide-react';
import { ClassNames } from '@emotion/react';
import classes from './Id.module.css';

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
      link.download = `${comp || 'export'}.png`;
      link.href = dataUrl;
      link.click();
    })
    .catch((err) => console.error("Napaka pri slikanju:", err));
  }, [ref, comp, width, height]);

  return (
  <>
    <button onClick={shraniPng}>
      <Camera size={18} />
    </button>

   <div style={{ position: 'absolute', left: '-9999px', top: '0', backgroundColor: '#1e293b' }}>
  <div ref={ref} style={{ 
    width: width, 
    height: height, // Fiksna višina prepreči spodnji bel rob
    margin: '0',
    padding: '0',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }}>
    <h2 className={classes.naslov}>{comp.title}</h2>
    <h3 className={classes.podnaslov}>{comp.startDate}</h3>
    <h3 className={classes.podnaslov}>{comp.city}</h3>
    
    {contentToExport}
  </div>
</div>
  </>
);
}