import classes from "./Ostalo.module.css";


export default function Legenda () {




    return (
        <div className={classes.legend}>
          <div className={classes.legendItem}>
            <span className={`${classes.dot} ${classes.dotPlanned}`}></span>
            <span>Načrtovano</span>
          </div>
          <div className={classes.legendItem}>
            <span className={`${classes.dot} ${classes.dotInGame}`}></span>
            <span>V teku</span>
          </div>
          <div className={classes.legendItem}>
            <span className={`${classes.dot} ${classes.dotFinished}`}></span>
            <span>Zaključeno</span>
          </div>
         
        </div>
    )
}