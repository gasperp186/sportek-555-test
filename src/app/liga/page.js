
"use client";

const teams = [
  { id: "t1", name: "A" },
  { id: "t2", name: "B" },
  { id: "t3", name: "C" },
  { id: "t4", name: "D" },
];
function zgenerirajTekme(teams, isDouble) {

    
  const matches = [];

  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
        matches.push({home: teams[i].name, away: teams[j].name});

        
    }
  }


  return matches;
}

function mesanjeTekem(array) {

    const copy = [...array];

    for (let i = copy.length - 1; i > 0; i--) {
        let index = Math.floor(Math.random() * (i + 1));
        let temp = copy[i];
        copy[i] = copy[index];
        copy[index] = temp;

       
}
 return copy;
}

function razdeliVKroge(matches) {

  const rounds = [];
  const copy = [...matches];

  while(copy.length > 0) {
    const used = []; 
    const roundMatches = [];

    for (let i = 0; i < copy.length; i++) {
      const match = copy[i];

    if ( used.includes(match.home) || used.includes(match.away) ) {
    
    } else {
    
    roundMatches.push(match);

    used.push(match.home);
    used.push(match.away);

    copy.splice(i, 1);
    i--;
    }
    }
    rounds.push(roundMatches);
}
    return rounds;
}

function obrniKroge(rounds) {
  return rounds.map((round) =>
    round.map((m) => ({ home: m.away, away: m.home }))
  );
}



const isDouble = true; 

const firstHalf = razdeliVKroge(mesanjeTekem(zgenerirajTekme(teams, false)));

let rounds;

if (isDouble) {
  rounds = [...firstHalf, ...obrniKroge(firstHalf)];
} else {
  rounds = firstHalf;
}

console.log(rounds);

export default function LigaPage() {
  return (
    <div>
      <h1>Liga</h1>
    </div>
  );
}