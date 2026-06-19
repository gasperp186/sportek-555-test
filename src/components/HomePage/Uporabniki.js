import React from "react";
import classes from "./Uporabniki.module.css";

const podatki = [
  {
    chip: "Organizator",
    title: "Enostavno vodenje tekmovanj",
    text: "Hitro odpri javne prijave z omejitvijo ekip, avtomatsko generiraj ligaški žreb in brez truda upravljaj razpored po krogih.",
    image: "/images/merge1.jpg"
  },
  {
    chip: "Igralec",
    title: "Urnik in rezultati",
    text: "Spremljaj svoje prihajajoče in odigrane tekme preko koledarja. Vsi podatki so vedno ažurni.",
    image: "/images/merge2.jpg"
  },
  {
    chip: "Gledalec",
    title: "Spremljanje v živo",
    text: "Izberi tekmovanje in si oglej trenutno lestvico lige, točke ter izide tekem. Idealno za navijače in spremljanje rezultatov.",
    image: "/images/merge3.jpg"
  },
];

function Card({ p }) {
  return (
    <article className={classes.card}>
      <div className={classes.media} style={{ width: "100%", overflow: "hidden" }}>
        <img 
          src={p.image} 
          alt={p.chip} 
          loading="lazy" 
          style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }} 
        />
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