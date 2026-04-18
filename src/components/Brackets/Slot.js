// import React from "react";
// import classes from "./Slot.module.css";

// export default function Slot({
//   label,
//   value,
//   options,
//   onChange,
//   usedIds = [],
//   disabled = false,
// }) {
//   const isDuplicate = !!value && usedIds.includes(value);

//   return (
//     <div
//       className={`${classes.slot} ${disabled ? classes.isDisabled : ""} ${
//         isDuplicate ? classes.isError : ""
//       }`}
//     >
//       <div className={classes.inlineRow}>
//         <span className={classes.labelInline}>{label}</span>

//         <select
//           className={classes.selectInline}
//           value={value ?? ""}
//           disabled={disabled}
//           aria-invalid={isDuplicate ? "true" : "false"}
//           onChange={(e) => onChange(e.target.value || null)}
//         >
//           <option value="">Izberi ekipo…</option>
//           {options.map((opt) => {
//             const taken = usedIds.includes(opt.id) && opt.id !== value;
//             return (
//               <option key={opt.id} value={opt.id} disabled={taken}>
//                 {opt.seed ? `#${opt.seed} ` : ""}
//                 {opt.name}
//                 {taken ? " (zasedeno)" : ""}
//               </option>
//             );
//           })}
//         </select>
//       </div>

     
//     </div>
//   );
// }
