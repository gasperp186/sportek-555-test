import React from "react";
import classes from "./Uporabniki.module.css";



const podatki = [
  {
    chip: "Organizator",
    title: "Enostavno vodenje tekmovanj",
    text: "Hitro odpri javne prijave z omejitvijo ekip, avtomatsko generiraj ligaški žreb in brez truda upravljaj razpored po krogih.",
  },
  {
    chip: "Igralec",
    title: "Urnik in rezultati vedno pri roki",
    text: "Spremljaj svoje prihajajoče in odigrane tekme preko koledarja. Vsi podatki so vedno ažurni.",
  },
  {
    chip: "Gledalec",
    title: "Spremljanje v živo",
    text: "Preprosto izberi šport in si oglej trenutno lestvico lige, točke ter izide tekem. Idealno za navijače in spremljanje rezultatov.",
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
          <h1 className={classes.naslov}>{title}</h1>
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