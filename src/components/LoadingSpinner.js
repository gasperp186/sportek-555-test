"use client";

import classes from "./LoadingSpinner.module.css";

export default function LoadingSpinner() {
  return (
    <div className={classes.container}>
      <div className={classes.box}>
        <div className={classes.spinner}></div>
        <p className={classes.text}>Nalaganje...</p>
      </div>
    </div>
  );
}