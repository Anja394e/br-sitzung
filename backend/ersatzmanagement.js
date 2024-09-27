// ersatzmanagement.js

// Initialisierung der Geschlechterquote aus dem localStorage oder Standardwert 2
let geschlechtsanteil_w = localStorage.getItem("geschlechtsanteil_w") ? parseInt(localStorage.getItem("geschlechtsanteil_w")) : 2;

// Sucht die männliche Ersatzperson mit dem höchsten Listenplatz
function finde_hoechste_maennliche_ersatzperson(eingeladen) {
    return eingeladen
        .filter(person => person.geschlecht === 'm' && person.liste === 2) // Nur Ersatzpersonen (Liste 2) und männlich
        .sort((a, b) => b.listenplatz - a.listenplatz)[0]; // Höchster Listenplatz zuerst
}

// Sucht die weibliche Ersatzperson mit dem niedrigsten Listenplatz
function finde_niedrigste_weibliche_ersatzperson(eingeladen) {
    return ersatz_personen
        .filter(person => person.geschlecht === 'w' && !eingeladen.includes(person) && person.anwesend)
        .sort((a, b) => a.listenplatz - b.listenplatz)[0];
}

// Sucht die Ersatzperson mit dem niedrigsten Listenplatz (beliebiges Geschlecht)
function finde_beliebige_ersatzperson(eingeladen) {
    return ersatz_personen
        .filter(person => !eingeladen.includes(person) && person.anwesend) // Nur nicht eingeladene und anwesende Personen
        .sort((a, b) => a.listenplatz - b.listenplatz)[0]; // Person mit niedrigstem Listenplatz zuerst
}

// Berechnet die Anzahl der weiblichen Personen unter den eingeladenen Personen
function anzahl_weiblich(eingeladen) {
    return eingeladen.filter(person => person.geschlecht === 'w').length;
}

// Logik zur Einladung von Personen und Management der Frauenquote
function eingeladene_personen(ordentliche_mitglieder, ersatz_personen) {
    let eingeladen = []; // Liste der final eingeladenen Personen
    let nachgeladen_fuer = {}; // Dictionary, um nachzuhalten, für wen eine Ersatzperson nachgeladen wurde
    let fehlende_mitglieder = ordentliche_mitglieder.filter(person => !person.anwesend).length;

    // Zunächst werden alle anwesenden ordentlichen Mitglieder eingeladen
    ordentliche_mitglieder.forEach(person => {
        if (person.anwesend) {
            eingeladen.push(person);
        }
    });

    // Für jede nicht anwesende Person wird eine Ersatzperson nachgeladen
    ordentliche_mitglieder.forEach(person => {
        if (!person.anwesend && fehlende_mitglieder > 0) {
            let ersatz;
            do {
                ersatz = finde_beliebige_ersatzperson(eingeladen);
            } while (ersatz && eingeladen.includes(ersatz));

            if (ersatz) {
                eingeladen.push(ersatz);
                nachgeladen_fuer[ersatz.name] = person.name;
                fehlende_mitglieder--;
            } else {
                console.log("Keine Ersatzpersonen mehr verfügbar.");
            }
        }
    });

    // Überprüfe die Mindestanzahl an Frauen
    while (anzahl_weiblich(eingeladen) < geschlechtsanteil_w) {
        let weibliche_ersatz = finde_niedrigste_weibliche_ersatzperson(eingeladen);
        if (!weibliche_ersatz) {
            console.log("Keine weiblichen Ersatzpersonen mehr verfügbar.");
            break;
        }

        let maennliche_ersatz = finde_hoechste_maennliche_ersatzperson(eingeladen);
        if (!maennliche_ersatz) {
            console.log("Keine männlichen Ersatzpersonen mehr zum Entfernen verfügbar.");
            break;
        }

        eingeladen = eingeladen.filter(person => person !== maennliche_ersatz);
        eingeladen.push(weibliche_ersatz);
        nachgeladen_fuer[weibliche_ersatz.name] = `ersetzt ${maennliche_ersatz.name}`;
        ersatz_personen = ersatz_personen.filter(person => person !== weibliche_ersatz);
    }

    return { eingeladen, nachgeladen_fuer };
}
