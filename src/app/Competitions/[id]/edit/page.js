"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { competitions as data } from "@/data/Competitions";
import classes from "./CompetitionEditPage.module.css";
import CompetitionDetails from "@/components/Competitions/CompetitionDetails";
import Osnovno from '@/components/Edit/Osnovno'
import Dostop from "@/components/Edit/Dostop";
import Prijave from "@/components/Edit/Prijave";

import { db } from "@/lib/firebase";
import { getDoc, doc, updateDoc } from "firebase/firestore";

import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";



export default function CompetitionEditPage() {
  const { id } = useParams();
  const [tab, setTab] = useState("tekme");

  const [comp, setComp] = useState(null);
  const [savedComp, setSavedComp] = useState(null);
  const router = useRouter();

  const [role, setRole] = useState("");


  function onChange(e) {

     const { name, value } = e.target;
     setComp((prev) => ({...prev, [name] : value}));

  }

  async function handleSave() {

    const saveRef = doc(db, "competitions", id);
    const saveShot = await updateDoc(saveRef, comp);
  }

  
  useEffect(() => {

    async function getData() {

       const compRef = doc(db, "competitions", id);
       const compShot = await getDoc(compRef);

       if(compShot.exists()) {
        setComp(compShot.data());
        setSavedComp(compShot.data());
       }

    }

   
    getData();

    async function verifyAccess() {
    const compRef = doc(db, "competitions", id);
    const compSnap = await getDoc(compRef);

    if (compSnap.exists()) {
      const data = compSnap.data();
      const currentUser = auth.currentUser;

      const isOwner = currentUser?.uid === data.createdBy;
      const isEditor = data.editors?.includes(currentUser?.uid);

      if(isOwner) {
        setRole("owner")
      } else if(isEditor) {
        setRole("editor")
      }

      if (!isOwner && !isEditor) {
        
        router.push(`/Competitions/${id}`); // Pošlji ga na javni ogled
      }
    }
  }
  
  if (id) verifyAccess();

  }, [id])

  if (!comp) return <div>Ni tekmovanja za id: {id}</div>

  return (
    <div className={classes.page}>
      {/* HEADER */}
      <div className={classes.headBox}>
        <div className={classes.titleBox}>
          <h2>{savedComp.title}</h2>
          <div>
            {comp.sport} • {comp.location} • {comp.date}
          </div>
        </div>

        <div className={classes.actions}>
          <Link href={`/Competitions/${id}`}>Ogled</Link>
          <button onClick={handleSave} type="button">Shrani</button>
        </div>
      </div>

      {role === "owner" && (

        <div className={classes.tabs}>
        <button
          type="button"
          onClick={() => setTab("tekme")}
          className={`${classes.tabBtn} ${
            tab === "tekme" ? classes.tabBtnActive : ""
          }`}
        >
          Tekme
        </button>

        <button
          type="button"
          onClick={() => setTab("osnovno")}
          className={`${classes.tabBtn} ${
            tab === "osnovno" ? classes.tabBtnActive : ""
          }`}
        >
          Osnovno
        </button>

        <button
          type="button"
          onClick={() => setTab("prijave")}
          className={`${classes.tabBtn} ${
            tab === "prijave" ? classes.tabBtnActive : ""
          }`}
        >
          Prijave
        </button>

        <button
          type="button"
          onClick={() => setTab("dostop")}
          className={`${classes.tabBtn} ${
            tab === "dostop" ? classes.tabBtnActive : ""
          }`}
        >
          Dostop
        </button>

      </div>
      )}

      {role === "editor" && (

        <div className={classes.tabs}>
        <button
          type="button"
          onClick={() => setTab("tekme")}
          className={`${classes.tabBtn} ${
            tab === "tekme" ? classes.tabBtnActive : ""
          }`}
        >
          Tekme
        </button>

        <button
          type="button"
          onClick={() => setTab("osnovno")}
          className={`${classes.tabBtn} ${
            tab === "osnovno" ? classes.tabBtnActive : ""
          }`}
        >
          Osnovno
        </button>

       

       

      </div>
      )}

      {/* TABS */}
      

      {/* CONTENT */}
      <div className={classes.card}>
        {tab === "tekme" && (
          <>
            <h3>Tekme</h3>
            <CompetitionDetails id={id} initialData={comp} isEditMode={true} />
          </>
        )}

        {tab === "osnovno" && (
          <>
            <Osnovno data={comp} onChange={onChange} />
          </>
        )}

        {tab === "dostop" && (
          <>
            <Dostop data={comp} onChange={onChange} />
          </>
        )}

        {tab === "prijave" && (
          <>
            <Prijave data={comp} onChange={onChange} />
          </>
        )}
      </div>
    </div>
  );
}
