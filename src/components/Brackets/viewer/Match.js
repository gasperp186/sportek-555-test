"use client";
import Link from "next/link";

export default function Match({
  id, basePath = "", status = "", date = "", time = "",
  top, bottom, roundTitle, classes, isExport = false 
}) {
  const href = `${basePath}/${id}`.replace(/\/+/g, "/");
  
  // Vedno uporabi originalna imena razredov iz CSS
  
  const statusClass = 
    status === "live" ? classes.borderInGame : 
    status === "scheduled" ? classes.borderPlanned : 
    classes.borderFinished;

  const blockCls = isExport ? `${classes.block} ${classes.block2}` : classes.block;
  const matchupCls = isExport ? `${classes.matchup} ${classes.matchup2}` : classes.matchup;
  const roundCls = isExport ? `${classes.roundDetails} ${classes.roundDetails2}` : classes.roundDetails;

  return (
    <div className={blockCls}>
      {roundTitle && <div className={roundCls}>{roundTitle}</div>}
      {/* Dodamo matchupCls IN statusClass hkrati */}
      <Link className={`${matchupCls} ${statusClass}`} href={href}>
        <ul>
          <li className={isExport ? `${classes.metaRow} ${classes.metaRow2}` : classes.metaRow}>
            <span className={classes.date}>{date || "TBD"}</span>
            <span className={classes.time}>{time}</span>
          </li>
          <li className={isExport ? `${classes.topTeam} ${classes.topTeam2}` : classes.topTeam}>
            {top}
          </li>
          <li className={isExport ? `${classes.downTeam} ${classes.downTeam2}` : classes.downTeam}>
            {bottom}
          </li>
        </ul>
      </Link>
    </div>
  );
}