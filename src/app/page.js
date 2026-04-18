import Link from "next/link";
import classes from './Home.module.css'; '@/components/layout/Colors.module.css';
import KajLahkoNaredim from '@/components/HomePage/KajLahkoNaredim';
import Uporabniki from '@/components/HomePage/Uporabniki';


function HomePage()  {

    return (
        <>
        <div className={classes.homebox}>

  
  <div className={classes.overlayText}>
    <h1 className={classes.glavniNaslov}>Organiziraj športna tekmovanja</h1>
    <h2 className={classes.naslov}>Hitro, pregledno in brez zapletov</h2>

    <p className={classes.podnaslov}>
      Ustvari dogodek, dodaj ekipe in spremljaj rezultate v realnem času.<br />
      Sportek poskrbi za razporede, lestvice in javni prikaz tekem.
    </p>

    <Link href="/Create" className={classes.ustvariBtn}>
  Ustvari tekmovanje
</Link>
  </div>
</div>

<KajLahkoNaredim />
<Uporabniki />
     
        </>
        
    )
}
export default HomePage;