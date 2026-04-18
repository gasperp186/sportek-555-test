import Link from 'next/link';

export default function LeagueRound({ matchesThisRound, basePath, classes }) {
  return (
    <div className={classes.matchList}>
      {matchesThisRound.map((m, index) => {
        const href = `${basePath}/${m.id}`.replace(/\/+/g, "/");

        const status = m.status;
         const statusClass = 
      status === "live" ? classes.borderInGame : 
      status === "scheduled" ? classes.borderPlanned : 
      classes.borderFinished;
        
        // Logika za prikaz datuma: 
        // Pokaži datum, če je to prva tekma ali če je datum drugačen od prejšnje tekme
        const showDate = index === 0 || m.date !== matchesThisRound[index - 1].date;

        return (
          <div key={m.id}>
            {/* Izpis datuma, če se spremeni */}
            {showDate && (
              <div className={classes.date}>
                {m.date || "Datum ni določen"}
              </div>
            )}

            <Link href={href} className={`${classes.matchRow} ${statusClass}`}>
              <span className={classes.matchTime}>{m.time || "--:--"}</span>
              
              <div className={classes.matchContent}>
                <span className={classes.teamLeft}>{m.home}</span>
                <span className={classes.score}>
                  {m.homeScore ?? "-"} : {m.awayScore ?? "-"}
                </span>
                <span className={classes.teamRight}>{m.away}</span>
              </div>

              
            </Link>
          </div>
        );
      })}
    </div>
  );
}