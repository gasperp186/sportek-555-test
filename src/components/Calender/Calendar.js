"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import slLocale from "@fullcalendar/core/locales/sl";
import classes from "./Calender.module.css";

export default function Calendar({ events }) {
  // To ti bo v konzoli izpisalo prejete dogodke
  console.log("Dogodki v koledarju:", events);

  return (
    <div className={classes.page}>
      <div className={classes.calendarwrapper}>
        <h1 className={classes.calendartitle}>Koledar tekem</h1>
        <FullCalendar
  plugins={[dayGridPlugin, interactionPlugin]}
  initialView="dayGridMonth"
  events={events}
  locale={slLocale}
  height="auto"
  eventDisplay="block"
  fixedWeekCount={false}
  // TUKAJ JE SPREMEMBA:
  headerToolbar={{
    left: "",               // Prazno na levi
    center: "prev title next", // Vse skupaj na sredini (zaporedje: < Julij 2026 >)
    right: "",              // Prazno na desni
  }}
  // Neobvezno: če želiš, da je med puščicami in naslovom malo več razmika
  titleFormat={{ year: 'numeric', month: 'long' }} 
/>
      </div>
    </div>
  );
}