'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ReorderIcon from "@mui/icons-material/Reorder";
import CloseIcon from "@mui/icons-material/Close";
import classes from "./MainNavigation.module.css";

import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";


export default function MainNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const router = useRouter();

  const isActive = (href) => pathname === href;

  const toggleMenu = () => setIsOpen(v => !v);
  const closeMenu = () => setIsOpen(false);

const [authUser, setAuthUser] = useState(null); //profil iz Firebase Auth
const [profile, setProfile] = useState(null);  //profil iz Firestore

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => { //usakič ko se prijava spremeni
      setAuthUser(user);

      if (!user) {
        setProfile(null);
        return;
      }

      const profile = await getDoc(doc(db, "users", user.uid));
      if (profile.exists()) {
        setProfile(profile.data()); 
      } else {
        setProfile(null);
      }
    });
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/"); // To te vrže na prvo stran po odjavi
    } catch (error) {
      console.error("Napaka pri odjavi:", error);
    }
  };
  


  return (
    <header className={`${classes.header} ${isOpen ? classes.menuOpen : ""}`}>
      <div className={classes.logoContainer}>
        <span className={classes.logoText}>Sportek</span>
      </div>

      <nav className={classes.navDesktop} aria-label="Glavna navigacija">
        <ul className={classes.list}>
          <li>
            <Link href="/" className={isActive("/") ? classes.active : ""}>
              Domov
            </Link>
          </li>
           <li>
            <Link href="/Create" className={isActive("/Create") ? classes.active : ""}>
              Ustvari tekmovanje
            </Link>
          </li>
          <li>
            <Link
              href="/Competitions"
              className={isActive("/Competitions") ? classes.active : ""}
            >
              Tekmovanja
            </Link>
          </li>
          <li>
            <Link href="/Calendar" className={isActive("/Calendar") ? classes.active : ""}>
              Koledar
            </Link>
          </li>
        
        </ul>
      </nav>

    {!authUser && (
  <div  className={classes.buttons}>
    <Link href="/Login"  className={classes.login}>Prijava</Link>
    <Link href="/SignUp"  className={classes.signUp}>Registracija</Link>
  </div>
)}

{authUser && (
  <div className={classes.prijavljenDiv}>
    <Link href="/Profil" className={classes.profilName}>{profile?.name} {profile?.surname}  &#8595;</Link>
    <button className={
      classes.logoutBtn
    } onClick={handleLogout} href="/">Odjava</button>
  </div>
)}

      <button
        type="button"
        className={classes.hamburger}
        aria-label={isOpen ? "Zapri meni" : "Odpri meni"}
        aria-expanded={isOpen}
        onClick={toggleMenu}
      >
        {isOpen ? <CloseIcon /> : <ReorderIcon />}
      </button>

      <div className={`${classes.mobileMenu} ${isOpen ? classes.open : ""}`}>
        <nav aria-label="Mobilna navigacija">
          <ul className={classes.mobileList}>
            <li><Link href="/" onClick={closeMenu}>Domov</Link></li>
            <li><Link href="/Competitions" onClick={closeMenu}>Tekmovanja</Link></li>
            <li><Link href="/Calendar" onClick={closeMenu}>Koledar</Link></li>
            <li>
            <Link href="/Profil" className={isActive("/Profil") ? classes.active : ""}>
              Moj profil
            </Link>
          </li>
          </ul>
        </nav>

        <div className={classes.mobileAuth}>
          <Link href="/Login" className={classes.loginBtn} onClick={closeMenu}>
            Prijavi se
          </Link>
          <Link href="/SignUp" className={classes.registerBtn} onClick={closeMenu}>
            Registriraj se
          </Link>
        </div>
      </div>

      {isOpen && <div className={classes.backdrop} onClick={closeMenu} />}
    </header>
  );
}
