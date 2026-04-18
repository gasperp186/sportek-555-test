import classes from './KajLahkoNaredim.module.css';
import { Wrench, Settings, Globe } from "lucide-react";

export default function KajLahkoNaredim() {
  return (
      <section className={classes.wrap} aria-labelledby="whatcan-title">
        <div className={classes.inner}>
          <h1 className={classes.naslov}>Kaj lahko naredim?</h1>

          <div className={classes.grid}>
            <article className={classes.card}>
              <Wrench size={30} strokeWidth={2} style={{ marginRight: "8px" }}></Wrench>
              <h3 className={classes.cardTitle}>Ustvari dogodek</h3>
              <p className={classes.desc}>Izberi šport in format (liga, turnir ali izločilni sistem).
  Aplikacija samodejno prilagodi strukturo tekmovanja glede na izbrani tip.</p>
            </article>

            <article className={classes.card}>
              <Settings size={30} strokeWidth={2} style={{ marginRight: "8px" }}></Settings>
              <h3 className={classes.cardTitle}>Upravljaj rezultate</h3>
              <p className={classes.desc}>Po vsakem odigranem dvoboju preprosto vnesi rezultate – sistem samodejno 
                izračuna posodobljeno lestvico, razpored naslednjih tekem in uvrstitve ekip..</p>
            </article>

            <article className={classes.card}>
              <Globe size={30} strokeWidth={2} style={{ marginRight: "8px" }}></Globe>
              <h3 className={classes.cardTitle}>Deli s svetom</h3>
              <p className={classes.desc}>Ko ustvariš turnir, prejmeš unikatno povezavo, ki jo lahko deliš z igralci, 
                navijači ali prijatelji. Vsakdo lahko spremlja rezultate, razporede in napredovanje ekip v živo.</p>
            </article>
          </div>
        </div>
      </section>
  );
}
