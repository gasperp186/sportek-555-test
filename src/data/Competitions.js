
const matchesC1 = [
  
  {
    id: "R1_1",
    label: "1. krog",
    home: "Koper",
    away: "Izola",
    date: "2025-05-12",
    time: "16:00",
    city: "Koper",
    location: "Bonifika",
    scoreHome: 1,
    scoreAway: 0,
    status: "finished",
  },
  {
    id: "R1_2",
    label: "1. krog",
    home: "Sežana",
    away: "Piran",
    date: "2025-05-12",
    time: "17:00",
    city: "Koper",
    location: "Bonifika",
    scoreHome: null,
    scoreAway: null,
    status: "Ni začeta",
  },
  {
    id: "R1_3",
    label: "1. krog",
    home: "Ankaran",
    away: "Lucija",
    date: "2025-05-12",
    time: "18:00",
    city: "Koper",
    location: "Bonifika",
    scoreHome: null,
    scoreAway: null,
    status: "Ni začeta",
  },
  {
    id: "R1_4",
    label: "1. krog",
    home: "Portorož",
    away: "Dekani",
    date: "2025-05-12",
    time: "19:00",
    city: "Koper",
    location: "Bonifika",
    scoreHome: 3,
    scoreAway: 4,
    status: "Ni začeta",
  },


  {
    id: "SF1",
    label: "Polfinale",
    home: null,
    away: null,
    date: "2025-05-15",
    time: "18:00",
    city: "Koper",
    location: "Bonifika",
    scoreHome: null,
    scoreAway: null,
    status: "Ni začeta",
  },
  {
    id: "SF2",
    label: "Polfinale",
    home: null,
    away: null,
    date: "2025-05-15",
    time: "19:00",
    city: "Koper",
    location: "Bonifika",
    scoreHome: null,
    scoreAway: null,
    status: "Ni začeta",
  },

  {
    id: "F1",
    label: "Finale",
    home: null,
    away: null,
    date: "2025-05-18",
    time: "20:00",
    city: "Koper",
    location: "Bonifika",
    scoreHome: null,
    scoreAway: null,
    status: "Ni začeta",
  },
  {
    id: "T3",
    label: "Tekma za 3. mesto",
    home: null,
    away: null,
    date: "2025-05-18",
    time: "18:30",
    city: "Koper",
    location: "Bonifika",
    scoreHome: null,
    scoreAway: null,
    status: "Ni začeta",
  },
];

const matchesC2 = [
  {
    id: "SF1",
    label: "Polfinale 1",
    home: "Bežigrad",
    away: "Šiška",
    date: "2025-06-03",
    time: "18:00",
    city: "Ljubljana",
    location: "Tivoli",
    scoreHome: 4,
    scoreAway: 2,
    status: "Končana",
  },
  {
    id: "SF2",
    label: "Polfinale 2",
    home: "Center",
    away: "Vič",
    date: "2025-06-03",
    time: "19:00",
    city: "Ljubljana",
    location: "Tivoli",
    scoreHome: 3,
    scoreAway: 5,
    status: "Končana",
  },
  {
    id: "F1",
    label: "Finale",
    home: null,
    away: null,
    date: "2025-06-05",
    time: "20:00",
    city: "Ljubljana",
    location: "Tivoli",
    scoreHome: null,
    scoreAway: null,
    status: "Ni začeta",
  },
  {
    id: "T3",
    label: "Tekma za 3. mesto",
    home: null,
    away: null,
    date: "2025-06-05",
    time: "18:30",
    city: "Ljubljana",
    location: "Tivoli",
    scoreHome: 2,
    scoreAway: 1,
    status: "Ni začeta",
  },
];


export const matchesC4 = [
  {
    id: "c4_r1_m1",
    competitionId: "c4",
    type: "LEAGUE",
    round: 1,

    home: "Skala",
    away: "Trata",

    date: "2025-06-05",
    time: "18:30",
    city: "Ljubljana",
    location: "Tivoli",

    scoreHome: 3,
    scoreAway: 2,
    status: "finished",
  },

  {
    id: "c4_r2_m1",
    competitionId: "c4",
    type: "LEAGUE",
    round: 2,

    date: "2025-06-05",
    time: "18:30",
    city: "Ljubljana",
    location: "Tivoli",

    home: "Trata",
    away: "Postojna",

    scoreHome: 1,
    scoreAway: 3,
    status: "scheduled",
  },

  {
    id: "c4_r3_m1",
    competitionId: "c4",
    type: "LEAGUE",
    round: 3,

    home: "Postojna",
    away: "Skala",

    date: "2025-06-05",
    time: "18:30",
    city: "Ljubljana",
    location: "Tivoli",

    scoreHome: 2,
    scoreAway: 3,
    status: "scheduled",
  },
];


export const competitions = [
  {
    id: "c1",
    title: "Turnir Koper",
    sport: "Nogomet",
    location: "Koper",
    date: "12.–18. maj 2025",
    dateFrom: "2026-02-12",
    dateTo: "2026-02-14",
    bracketSize: 8,
    teams: [
      "Koper",
      "Izola",
      "Sežana",
      "Piran",
      "Ankaran",
      "Lucija",
      "Portorož",
      "Dekani",
    ],

    matches: matchesC1,

    allowRegistrations: false,
    registrationDeadline: null,
    maxTeams: 8,
    publishMode: "SCHEDULE_ONLY",
    rules: "Temovanje se igra 4 ure in 8 dni in na 3 igriščih 15 minut"
  },

  {
    id: "c2",
    title: "Ljubljana Open",
    sport: "Košarka",
    location: "Ljubljana",
    date: "3.–5. junij 2025",
    bracketSize: 4,
    teams: ["Bežigrad", "Šiška", "Center", "Vič"],

    matches: matchesC2,

    allowRegistrations: true,
    registrationDeadline: "2025-05-20",
    maxTeams: 8,
    publishMode: "SCHEDULE_ONLY",
  },

  {
    id: "c3",
    title: "Turnir odbojka",
    sport: "Odbojka na mivki",
    location: "Portorož",
    startDate: "2026-01-01",
    endDate: "2026-01-03",
    bracketSize: 8,
    teams: [
      "Ljubljana",
      "Maribor",
      "Celje",
      "Velenje",
      "Kranj",
      "Mura",
      "Koper",
      "Novo mesto",
    ],

    matches: [],

    allowRegistrations: false,
    registrationDeadline: "2025-08-10",
    maxTeams: 8,
    publishMode: "SCHEDULE_ONLY",
  },

  {
    id: "c4",
    title: "Kras Open",
    sport: "Pikado",
    location: "Pliskovica",
    date: "2026-01-01",
    mode: "ligaski",
    teams: [
      "Skala",
      "Trata",
      "Postojna",
    ],

    matches: matchesC4,

    allowRegistrations: true,
    registrationDeadline: "2026-01-01",
    maxTeams: 8,
    publishMode: "SCHEDULE_ONLY",
  },
];


export const tekmovanje = {
  id: "C1",
  name: "Pokal Primorske",
  matches: [
    {
      id: "M1",
      home: "Koper",
      away: "Izola",
      start: "2026-01-01T18:30:00"
    },
    {
      id: "M2",
      home: "Piran",
      away: "Sežana",
      start: "2026-02-02T17:00:00"
    }
  ]
};
