// "use client";

// import Slot from "./Slot";

// export default function TeamSide({
//   side,
//   label,
//   match,
//   teams,
//   isSemi,
//   usedExcept,
//   setTeam,
//   isPlaceholder,
//   placeholderText,
// }) {
//   const value = match[side];

//   return (
//     <div className={classes.teamSlot}>
//       <span className={classes.teamLabel}>{label}</span>

//       {isSemi ? (
//         <Slot
//           label=""
//           value={value}
//           options={teams}
//           usedIds={usedExcept(value)}
//           onChange={(val) => setTeam(match.id, side, val)}
//         />
//       ) : (
//         <div className={classes.teamPlaceholder}>
//           {isPlaceholder(value)
//             ? placeholderText(value, side)
//             : teams.find((t) => t.id === value)?.name || ""}
//         </div>
//       )}
//     </div>
//   );
// }
