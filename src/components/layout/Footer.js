import classes from './Footer.module.css';
import Link from "next/link";

function Footer() {
  return (
    <footer className={classes.footer}>
      <div className={classes.container}>

        <div className={classes.section}>
          <h3 className={classes.logo}>Sportek</h3>
          <p>Digitalna platforma za organizacijo in spremljanje športnih tekmovanj.</p>
          
        </div>

        <div className={classes.section}>
          <h4>Povezave</h4>
          <ul>
            <li><Link href="/">Domov</Link></li>
            <li><Link href="/Competitions">Tekmovanja</Link></li>
            <li><Link href="/koledar">Koledar</Link></li>
            <li><Link href="/Profil">Moj profil</Link></li>
          </ul>
        </div>

        <div className={classes.section}>
          <h4>Kontakt</h4>
          <p>Email: sportek@gmail.com</p>
        </div>
      </div>

      <div className={classes.bottom}>
        <p>© {new Date().getFullYear()} Sportek</p>
      </div>
    </footer>
  );
}

export default Footer;
