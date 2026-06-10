import Link from 'next/link';
import { formatDate } from '@/components/formatDate';

export default function LeagueRound({ matchesThisRound, basePath, classes, isExport }) {
 return (
    <div className={classes.matchList}>
      {matchesThisRound.map((m, index) => {
        const href = `${basePath}/${m.id}`.replace(/\/+/g, "/");

        const status = m.status;
        const statusClass = 
          status === "V teku" ? classes.borderInGame : 
          status === "Načrtovana" ? classes.borderPlanned : 
          classes.borderFinished;
        
        // Logika za prikaz datuma: 
        // Pokaži datum, če je to prva tekma ali če je datum drugačen od prejšnje tekme
        const showDate = index === 0 || m.date !== matchesThisRound[index - 1].date;

        return (
          <div key={m.id}>
            {/* Izpis datuma, če se spremeni */}
            {showDate && (
              <div className={isExport ? `${classes.date} ${classes.dateExport}` : classes.date}>
                {m.date ? formatDate(m.date) : "Datum ni določen"}
              </div>
            )}

            <Link href={href} className={isExport ? `${classes.matchRowExport} ${statusClass}` : `${classes.matchRow} ${statusClass}`}>
              {/* Ura je sedaj elegantno na začetku same vrstice */}
              <span className={isExport ? classes.matchTimeExport : classes.matchTime}>
                {m.time || "--:--"}
              </span>
              
              {/* Desno od ure sta ekipi in rezultat */}
              <div className={isExport ? classes.matchContentExport : classes.matchContent}>
                <span className={isExport ? classes.teamLeftExport : classes.teamLeft}>{m.home}</span>
                <span className={isExport ? classes.scoreExport : classes.score}>
                  {m.homeScore ?? "-"} : {m.awayScore ?? "-"}
                </span>
                <span className={isExport ? classes.teamRightExport : classes.teamRight}>{m.away}</span>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}