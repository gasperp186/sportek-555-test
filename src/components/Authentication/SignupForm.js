"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

import classes from "./LoginForm.module.css";

export default function Signup() {

  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");

  const [errors, setErrors] = useState({ emailInvalid: false, passwordInvalid: false });

  async function handleSubmit(e) {
    e.preventDefault();

    const emailInvalid = !email.includes("@");
    const passwordInvalid = password !== confirmPassword;

    setErrors({ emailInvalid, passwordInvalid });

   if ( passwordInvalid) return;

try {
  // Ustvarimo uporabnika v Firebase Auth
  const createUser = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  const uid = createUser.user.uid;

  // Shranimo dodatne podatke v Firestore
  await setDoc(doc(db, "users", uid), {
    name: firstName,
    surname: lastName,
    email,
    createdAt: serverTimestamp(),
  });

  // reset
  setEmail("");
  setFirstName("");
  setLastName("");
  setPassword("");
  setConfirmPassword("");
  setRole("");

} catch (err) {
  console.error(err);
}
  }


  return (
    <div className={classes.container}>
      <form onSubmit={handleSubmit} className={classes.form}>
        <h2 className={classes.title}>Registriraj se</h2>

        <div className={classes.control}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" value={email}   onChange={(e) => setEmail(e.target.value)}
 placeholder="you@example.com" required />
          {errors.emailInvalid && <p className={classes.error}>Prosim vnesite pravilen e-naslov</p>}
        </div>

        <div className={classes.row}>
          <div className={classes.control}>
            <label htmlFor="first">Ime</label>
            <input id="first" type="text"  required value={firstName}   onChange={(e) => setFirstName(e.target.value)}
 />
          </div>
          <div className={classes.control}>
            <label htmlFor="last">Priimek</label>
            <input id="last" type="text" required value={lastName}   onChange={(e) => setLastName(e.target.value)}
 />
          </div>
        </div>

        <div className={classes.row}>
          <div className={classes.control}>
            <label htmlFor="password">Geslo</label>
            <input
              id="password"
              type="password"
              minLength={6}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className={classes.control}>
            <label htmlFor="confirm">Potrdite geslo</label>
            <input id="confirm" type="password" minLength={6}   onChange={(e) => setConfirmPassword(e.target.value)}
                   required value={confirmPassword} />
            
          </div>
        </div>

        {/* <div className={classes.checkrow}>
          <input type="checkbox" id="terms" required />
          <label htmlFor="terms">Strinjam se s pogoji poslovanja</label>
        </div> */}
          {errors.passwordInvalid && <p className={classes.error}>Gesli se ne ujemata</p>}

        <div className={classes.actions}>
          <button type="submit" className={classes.button}>Registriraj se</button>
          <p className={classes.switch}>
            Že imaš račun? <a href="/Login">Prijavi se</a>
          </p>
        </div>
      </form>
    </div>
  );
  }
