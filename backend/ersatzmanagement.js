// ersatzmanagement.js
import { allePersonen } from './person.js'; // Verwende das gemeinsame Array 'allePersonen'
import { speicherePersonen } from './person.js'; // Falls du die Speicherung verwenden möchtest

console.log('allePersonen:', allePersonen); // Überprüfe, ob die allePersonen-Liste korrekt geladen wird

// Initialisierung der Geschlechterquote aus dem localStorage oder Standardwert 2
let geschlechtsanteil_w = localStorage.getItem("geschlechtsanteil_w") ? parseInt(localStorage.getItem("geschlechtsanteil_w")) : 2;

// Sucht die männliche Ersatzperson mit dem höchsten Listenplatz
function finde_hoechste_maennliche_ersatzperson(eingeladen) {
    return allePersonen
        .filter(person => person.geschlecht === 'm' && !person.ordentlich && person.anwesend && !eingeladen.includes(person)) // Nur Ersatzpersonen und männlich
        .sort((a, b) => b.listenplatz - a.listenplatz)[0]; // Höchster Listenplatz zuerst
}

// Sucht die weibliche Ersatzperson mit dem niedrigsten Listenplatz
function finde_niedrigste_weibliche_ersatzperson(eingeladen) {
    return allePersonen
        .filter(person => person.geschlecht === 'w' && !person.ordentlich && person.anwesend && !eingeladen.includes(person)) // Nur Ersatzpersonen und weiblich
        .sort((a, b) => a.listenplatz - b.listenplatz)[0]; // Niedrigster Listenplatz zuerst
}

// Sucht die Ersatzperson mit dem niedrigsten Listenplatz (beliebiges Geschlecht)
function finde_beliebige_ersatzperson(eingeladen) {
    return allePersonen
        .filter(person => !person.ordentlich && person.anwesend && !eingeladen.includes(person)) // Nur Ersatzpersonen, die anwesend sind
        .sort((a, b) => a.listenplatz - b.listenplatz)[0]; // Niedrigster Listenplatz zuerst
}

// Berechnet die Anzahl der weiblichen Personen unter den eingeladenen Personen
function anzahl_weiblich(eingeladen) {
    return eingeladen.filter(person => person.geschlecht === 'w').length;
}

// Logik zur Einladung von Personen und Management der Frauenquote
export function eingeladene_personen() {
    let eingeladen = []; // Liste der final eingeladenen Personen
    let nachgeladen_fuer = {}; // Dictionary, um nachzuhalten, für wen eine Ersatzperson nachgeladen wurde

    // Zunächst werden alle anwesenden ordentlichen Mitglieder eingeladen
    const ordentlicheMitglieder = allePersonen.filter(person => person.ordentlich); // Filtere ordentliche Mitglieder
    let fehlende_mitglieder = ordentlicheMitglieder.filter(person => !person.anwesend).length;

    ordentlicheMitglieder.forEach(person => {
        if (person.anwesend) {
            eingeladen.push(person);
        }
    });

    // Für jede nicht anwesende Person wird eine Ersatzperson nachgeladen
    ordentlicheMitglieder.forEach(person => {
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
    }

    return { eingeladen, nachgeladen_fuer };
}
