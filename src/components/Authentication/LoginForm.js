"use client";

import { useRef, useState, Suspense } from "react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";

import classes from "./LoginForm.module.css";

// Glavna komponenta, ki jo Next.js pričakuje
export default function Login() {
  return (
    <Suspense fallback={<div className={classes.container}>Nalaganje...</div>}>
      <LoginForm />
    </Suspense>
  );
}

// Tvoja originalna logika, prestavljena v ločeno komponento
function LoginForm() {
  const [emailIsInvalid, setEmailIsInvalid] = useState(false);
  const email = useRef();
  const password = useRef();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loginError, setLoginError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    const enteredEmail = email.current.value.trim();
    const enteredPassword = password.current.value;

    const isInvalidEmail = !enteredEmail.includes("@");
    setEmailIsInvalid(isInvalidEmail);
    if (isInvalidEmail) return;

    try {
      await signInWithEmailAndPassword(auth, enteredEmail, enteredPassword);
      const next = searchParams.get("next");
      router.push(next || "/");
    } catch (err) {
      setLoginError("Napačen email ali geslo.");
      console.error(err);
    }
  }

  return (
    <div className={classes.container}>
      <form onSubmit={handleSubmit} className={classes.form}>
        <h2 className={classes.title}>Prijavi se</h2>

        <div className={classes.control}>
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            name="email"
            ref={email}
            placeholder="you@example.com"
            required
          />
          <p className={classes.error}>
            {emailIsInvalid ? "Prosim vnesite pravilen e-naslov" : ""}
          </p>
        </div>

        <div className={classes.control}>
          <label htmlFor="login-password">Geslo</label>
          <input
            id="login-password"
            type="password"
            name="password"
            ref={password}
            placeholder="••••••••"
            minLength={6}
            required
          />
        </div>
        {loginError && <p className={classes.error}>{loginError}</p>}

        <div className={classes.actions}>
          <button type="submit" className={classes.button}>
            Prijavi se
          </button>
          <p className={classes.switch}>
            Nimaš še računa? <a href="/SignUp">Registriraj se</a>
          </p>
        </div>
      </form>
    </div>
  );
}