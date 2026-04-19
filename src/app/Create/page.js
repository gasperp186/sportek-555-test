"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

import CreateCompetition from "@/components/Create/CreateCompetition";
import AddTeams from "@/components/Create/AddTeams";
import Sport from "@/components/Create/Sport";
import Draw from "@/components/Create/Draw";
import UrediPrijave from "@/components/Create/UrediPrijave";
import StepRules from "@/components/Create/StepRules";

const initialForm = {
   //šport
  sport: "",

  // create
  title: "",
  city: "",
  location: "",
  startDate: "",
  endDate: "",
  season:  "",
  mode: "",
  publicSignups: false,
  thirdPlaceMatch: true,

  
  // ekipe
  teams: [],
  maxTeams: 4,
  registrationDeadline: "",  
  knockoutTeamCount: null,


  // tekme
  matches: [],

  //pravila
  rulesText: "",
  // pointsWin: 3,
  // pointsDraw: 1,
  // pointsLoss: 0,
};

export default function CreatePage() {

  const router = useRouter();

  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(0);

  const [user, setUser] = useState(null);

  useEffect(() => {

    const PreveriLogin = onAuthStateChanged(auth, (user) => {
    setUser(user);

    if (!user) {
      router.push("/Login?next=/Create");
    }
  });

  return () => PreveriLogin();


  }, [router]);

 
useEffect(() => {
    // vsakič da se odpre na vrhu strani
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [step]);

  if (!user) return null;


  
  
  const next = () => {
  setStep((s) => {
    if (s === 1) return form.publicSignups ? 2 : 3;
    
    return s + 1;
  });
};

const back = () => {

  setStep((s) => {
    
    if (s === 5) return form.publicSignups ? 2 : 4; // iz Rules, če je publicSignUps gre na 2, če ne na 4

    if (s === 4) return 3; // iz Draw  nazaj na AddTeams

    if (s === 3 || s === 2) return 1; // iz AddTeams ali UrediPrijave nazaj na CreateCompetition

    return Math.max(s - 1, 0);
  });
};

  return ( //if ni dovoljen v return statementu zato imm tako:
    <>
      {step === 0 && <Sport setForm={setForm} onNext={next} />}   

      {step === 1 && (
        <CreateCompetition
          form={form}
          setForm={setForm}
          onNext={next}
          onBack={back}
        />
      )}

      {step === 2 && form.publicSignups && (
        <UrediPrijave
          form={form}
          setForm={setForm}
          onNext={next}
          onBack={back}
        />
      )}

      {step === 3 && !form.publicSignups && (
        <AddTeams
          form={form}
          setForm={setForm}
          onNext={next}
          onBack={back}
        />
      )}

      {step === 4 && (
        <Draw form={form} setForm={setForm} onNext={next} onBack={back} />
      )}

      {step === 5 && (
        <StepRules
          form={form}
          setForm={setForm}
          onNext={next}
          onBack={back}
        />
      )}
    </>
  );

  
}
