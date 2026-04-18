


export default function Bracket4Autofill(matches) {

    function getWinner(match) {

        if(match.homeScore === null || match.awayScore === null) {
             return null;
        }
           

        else if(match.homeScore > match.awayScore) {
            return match.home;
        }

        else if(match.homeScore < match.awayScore)  {
            return match.away;
        }
        else {
            return null;
        }


    }

    function getLoser(match) {

        if(match.homeScore === null || match.awayScore === null) {
             return null;
        }
           

        else if(match.homeScore > match.awayScore) {
            return match.away;
        }

        else if(match.homeScore < match.awayScore)  {
            return match.home;
        }
        else {
            return null;
        }


    }


    const next = matches.map(m => ({ ...m }));

    const sf1 = next.find(m => m.id ==="SF1")
    const sf2 = next.find(m => m.id ==="SF2")
    const f1 = next.find(m => m.id ==="F1")
    const t3 = next.find(m => m.id ==="T3")

    const w1 = getWinner(sf1);
    const w2 = getWinner(sf2);
    const l1 = getLoser(sf1);
    const l2 = getLoser(sf2);

    if (f1) {
        if (w1) {
            f1.home = w1;
        }
        if(w2) {
            f1.away = w2;
        }
    }

    if(t3) {
        if (l1) {
            t3.home = l1;
            
        }
        if (l2) {
            t3.away = l2;
        }

        
    }
return next;

}