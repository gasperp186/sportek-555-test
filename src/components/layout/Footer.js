'use client';

import classes from './Footer.module.css';
import Link from "next/link";
import { useState, useEffect } from "react"; // DODAN useEffect

import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth"; // Odstranjen signOut, če ga ne rabiš tu

function Footer() {
  const [authUser, setAuthUser] = useState(null);

  // Poslušalec za stanje prijave
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Uporabnik je prijavljen
        setAuthUser(user);
      } else {
        // Uporabnik ni prijavljen
        setAuthUser(null);
      }
    });

    // Počistimo poslušalca ob uničenju komponente
    return () => unsubscribe();
  }, []);

  return (
    <footer className={classes.footer}>
      <div className={classes.container}>

        <div className={classes.section}>
          <h3 className={classes.logo}>Sportek</h3>
          <p>Digitalna platforma za organizacijo in spremljanje športnih tekmovanj.</p>
        </div>

        <div className={classes.section}>
          <h4>Povezave</h4>
          <ul>
            <li><Link href="/">Domov</Link></li>
            <li><Link href="/Create">Ustvari tekmovanje</Link></li>
            <li><Link href="/Competitions">Tekmovanja</Link></li>
            <li><Link href="/Calendar">Koledar</Link></li>
            {/* Povezava se prikaže samo, ko authUser obstaja */}
            {authUser && (
              <li><Link href="/Profil">Moj profil</Link></li>
            )}
          </ul>
        </div>

        <div className={classes.section}>
          <h4>Kontakt</h4>
          <p>Email: sportek@gmail.com</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;