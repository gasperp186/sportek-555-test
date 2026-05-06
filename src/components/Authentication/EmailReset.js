"use client";

import { useRef, useState, Suspense } from "react";
import { auth } from "@/lib/firebase";
import { sendPasswordResetEmail } from "firebase/auth"; // Pravilen uvoz za Client SDK
import { useRouter } from "next/navigation";

import classes from "./LoginForm.module.css";

export default function EmailReset() {
  return (
    <Suspense fallback={<div className={classes.container}>Nalaganje...</div>}>
      <EmailResetForm />
    </Suspense>
  );
}

function EmailResetForm() {
  const [emailIsInvalid, setEmailIsInvalid] = useState(false);
  const [message, setMessage] = useState(""); // Za potrdilo o pošiljanju
  const [error, setError] = useState("");
  const emailRef = useRef();
  const router = useRouter();

  async function handleSubmit(event) {
  event.preventDefault();
  const enteredEmail = emailRef.current.value.trim();

  try {
    await sendPasswordResetEmail(auth, enteredEmail);
    setMessage("Povezava za ponastavitev je bila poslana na vaš elektronski naslov.");

    setTimeout(() => router.push("/Login"), 3000);

  } catch (error) {
    setError("Preverite, če je elektronski naslov pravilen.");
  }
}

  return (
    <div className={classes.container}>
      <form onSubmit={handleSubmit} className={classes.form}>
        <h2 className={classes.title}>Ponastavitev gesla</h2>
        <p style={{ textAlign: 'center', marginBottom: '1rem', color: '#475569' }}>
      Vnesite svoj e-poštni naslov. Če je račun v našem sistemu registriran, vam bomo nanj poslali povezavo za ponastavitev gesla.
    </p>

        <div className={classes.control}>
          <label htmlFor="reset-email">Elektronski naslov</label>
          <input
            id="reset-email"
            type="email"
            ref={emailRef}
            placeholder=""
            required
          />
          {emailIsInvalid && <p className={classes.error}>Vnesite veljaven email.</p>}
        </div>

        {message && <p style={{ color: "green", textAlign: "center" }}>{message}</p>}
        {error && <p className={classes.error} style={{ textAlign: "center" }}>{error}</p>}

        <div className={classes.actions}>
          <button type="submit" className={classes.button}>
            Pošlji
          </button>
          <p className={classes.switch}>
            <a href="/Login">Nazaj na prijavo</a>
          </p>
        </div>
      </form>
    </div>
  );
}