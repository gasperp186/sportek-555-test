import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import classes from "./ProfilePage.module.css";
import { db, auth } from "@/lib/firebase"; 
import { doc, getDoc } from "firebase/firestore";

export default function ProfilePage() {
  const auth = getAuth();
  const [currentUser, setCurrentUser] = useState(null);

  const [dbUser, setDbUser] = useState(null);

  useEffect(() => {
    // Poslušalec za prijavo uporabnika
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if(user) {
        const userRef = doc(db, "users", user.uid); // Pravilno
        const userSnap = await getDoc(userRef);

        if(userSnap.exists()) {
          setDbUser(userSnap.data());
        }
      }
    });

    // Počistimo ob zaprtju strani
    return () => unsubscribe();
  }, [auth]);

  // Pripravimo podatke za enostaven izpis (varnostna mreža)
  const name = currentUser?.name || "Neznano";

  const email = currentUser?.email || "Ni naloženo...";


  return (
    <div className={classes.page}>

      
      
      <section className={classes.rightCol}>
        <div className={classes.rightCard}>
          <div className={classes.headRight}>
                 
                      <h2 className={classes.naslov}>Moj profil</h2>
                    </div>

          <div className={classes.divider} />

          <ul className={classes.fields}>
            <li><span>Ime</span><span className={classes.value}>{dbUser?.name}</span></li>
            <li><span>Priimek</span><span className={classes.value}>{dbUser?.surname}</span></li>
            <li><span>Email</span><span className={classes.value}>{email}</span></li>
          </ul>

        </div>
      </section>
    </div>
  );
}
