"use client"; // To pove Next.js-u, da uporabi klientski router

import { useRouter, useSearchParams } from "next/navigation";
import classes from "@/components/Ostalo.module.css"; 

export default function BackButton() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleBack = () => {
    // Če URL vsebuje zavihek (?tab=), pomeni, da je uporabnik preklapljal znotraj hibrida.
    // V tem primeru ga gumb "Nazaj" direktno odpelje na krovno stran tekmovanj.
    if (searchParams.has("tab")) {
      router.push("/Competitions");
    } else {
      // Na vseh ostalih straneh gumb še naprej deluje standardno
      router.back();
    }
  };

  return (
    <button 
      onClick={handleBack} 
      className={classes.nazajButton}
    >
      Nazaj
    </button>
  );
}