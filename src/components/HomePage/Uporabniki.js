import React from "react";
import classes from "./Uporabniki.module.css";

const podatki = [
  {
    chip: "Organizator",
    title: "Učinkovito vodenje turnirjev",
    // imgSrc:
    // organizator,
    text:
      "Ustvari turnir v minutah, avtomatsko generiraj žreb in deli urnike. Poudarek je na hitrem pregledu ekip, rezultatov in obveščanju brez ročnega dela.",
  },
  {
    chip: "Igralec",
    title: "Rezultati in žreb na dosegu roke",
    // imgSrc:
    // igralci,
    text:
      "Hiter vpogled v napredovanje, naslednje tekme in lokacije. Brez zmede — vse ključne informacije so na mobilniku, vedno ažurne.",
  },
  {
    chip: "Gledalec",
    title: "Spremljanje v živo in deljenje",
    // imgSrc:
    // gledalci,
    text:
      "Preprosto najdi termin, teren in izid. Rezultate lahko deliš z enim klikom — idealno za prijatelje in navijače na tribunah.",
  },
];

function Card({ p }) {
  return (
    <article className={classes.card}>
      <div className={classes.media}>
        <img src={p.imgSrc} alt={p.chip} loading="lazy" />
      </div>

      <div className={classes.content}>
        <span className={classes.chip}>{p.chip}</span>
        <h3 className={classes.title}>{p.title}</h3>
        <p className={classes.text}>{p.text}</p>
      </div>
    </article>
  );
}

export default function Uporabniki({
  personas = podatki,
  title = "Uporabniki",
}) {
  return (
    <section className={classes.section}>
      <div className={classes.inner}>
      <div className={classes.header}>
        <h1 className={classes.naslov}>Uporabniki</h1>
      </div>

      <div className={classes.grid}>
        {personas.map((p, idx) => (
          <Card key={idx} p={p} />
        ))}
      </div>
      </div>
    </section>
  );
}
