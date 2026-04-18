"use client"; // To pove Next.js-u, da uporabi klientski router

import { useRouter } from "next/navigation";
import classes from "@/app/Competitions/[id]/Id.module.css"; 

export default function BackButton() {
  const router = useRouter();

  return (
    <button 
      onClick={() => router.back()} 
      className={classes.nazajButton}
    >
      Nazaj
    </button>
  );
}