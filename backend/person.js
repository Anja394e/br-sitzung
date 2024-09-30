import { displayPersonen } from './ui.js'; // Stelle sicher, dass displayPersonen nur importiert wird
import { addEventListeners } from './eventListeners.js';  // Stelle sicher, dass addEventListeners verfügbar ist

// Deklariere die exportierten Variablen
export let ordentliche_mitglieder = [];
export let ersatz_personen = [];

// Überprüfe zuerst die rohen Werte im localStorage und logge sie
let ordentliche_mitglieder_raw = localStorage.getItem("ordentliche_mitglieder");
let ersatz_personen_raw = localStorage.getItem("ersatz_personen");

console.log("Raw ordentliche_mitglieder:", ordentliche_mitglieder_raw);
console.log("Raw ersatz_personen:", ersatz_personen_raw);

// Fallback, falls die Daten nicht existieren
if (ordentliche_mitglieder_raw === null) {
    console.warn("Kein Eintrag für ordentliche_mitglieder gefunden, erstelle leeren Array.");
    localStorage.setItem("ordentliche_mitglieder", "[]");
    ordentliche_mitglieder_raw = "[]";  // Fallback auf leeren Array
}

if (ersatz_personen_raw === null) {
    console.warn("Kein Eintrag für ersatz_personen gefunden, erstelle leeren Array.");
    localStorage.setItem("ersatz_personen", "[]");
    ersatz_personen_raw = "[]";  // Fallback auf leeren Array
}

// Versuche, die Daten zu parsen und logge den Parsing-Status
try {
    ordentliche_mitglieder = JSON.parse(ordentliche_mitglieder_raw);
    console.log("Parsed ordentliche_mitglieder:", ordentliche_mitglieder);
} catch (e) {
    console.error("Fehler beim Parsen von ordentliche_mitglieder:", e);
    ordentliche_mitglieder = [];  // Fallback auf leeren Array
}

try {
    ersatz_personen = JSON.parse(ersatz_personen_raw);
    console.log("Parsed ersatz_personen:", ersatz_personen);
} catch (e) {
    console.error("Fehler beim Parsen von ersatz_personen:", e);
    ersatz_personen = [];  // Fallback auf leeren Array
}

// Die Person-Klasse definieren und exportieren
export class Person {
    constructor(ordentlich, liste, listenplatz, geschlecht, name, mail, anwesend) {
        this.id = this.generateId();
        this.ordentlich = ordentlich;
        this.liste = liste;
        this.listenplatz = listenplatz;
        this.geschlecht = geschlecht;
        this.name = name;
        this.mail = mail;
        this.anwesend = anwesend;
    }

    // Generiere eine eindeutige ID
    generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    // Benutzerdefinierte toString()-Methode für die Textrepräsentation
    toString() {
        return `${this.name} (Listenplatz: ${this.listenplatz}, ${this.ordentlich ? 'Ordentlich' : 'Ersatz'}, Liste: ${this.liste}, Geschlecht: ${this.geschlecht}, Anwesend: ${this.anwesend ? 'Ja' : 'Nein'})`;
    }
}


// Exportiere die Personenliste
export let allePersonen = [];

// Funktion zum Speichern der Personenliste im localStorage
export function speicherePersonen(allePersonen) {
    localStorage.setItem("allePersonen", JSON.stringify(allePersonen));
}

// Funktion zum Laden der Personen aus dem localStorage
export function ladePersonen() {
    let personenRaw = localStorage.getItem("allePersonen");
    if (personenRaw) {
        return JSON.parse(personenRaw);
    }
    return [];
}

// Personen beim Start laden
export let allePersonen = ladePersonen();


export function bearbeitenPerson(id) {
    // Suche die Person anhand der übermittelten ID im gemeinsamen Array 'allePersonen'
    let person = allePersonen.find(p => p.id === id);

    if (!person) {
        console.error('Person nicht gefunden mit ID:', id);
        return;  // Falls die Person nicht existiert, Funktion beenden
    }

    // Person existiert, nun die Formularfelder mit den Werten füllen
    document.getElementById("name").value = person.name;
    document.getElementById("email").value = person.mail;
    document.getElementById("geschlecht").value = person.geschlecht;
    document.getElementById("ordentlich").checked = person.ordentlich; // Neues Feld für ordentlich
    document.getElementById("liste").value = person.liste;
    document.getElementById("anwesend").checked = person.anwesend;
    document.getElementById("listenplatz").value = person.listenplatz;
}




// Funktion zum Löschen einer Person
export function loeschenPerson(id) {
    // Finde den Index der Person anhand der übermittelten ID
    const index = allePersonen.findIndex(p => p.id === id);

    if (index === -1) {
        console.error('Person nicht gefunden mit ID:', id);
        return;  // Falls die Person nicht existiert, Funktion beenden
    }

    // Person aus dem gemeinsamen Array entfernen
    allePersonen.splice(index, 1);

    // Personen in localStorage speichern
    speicherePersonen(allePersonen);

    // Aktualisiere die Tabelle
    displayPersonen();
}


// Funktion zum Hinzufügen einer neuen Person
document.getElementById("personenForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Verhindert das Neuladen der Seite

    // Hole die Werte aus dem Formular
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let geschlecht = document.getElementById("geschlecht").value;
    let ordentlich = document.getElementById("ordentlich").checked; // Boolean: ob ordentliches Mitglied
    let liste = parseInt(document.getElementById("liste").value); // Zugehörige Liste
    let anwesend = document.getElementById("anwesend").checked;
    let listenplatz = parseInt(document.getElementById("listenplatz").value); // Neue Listenposition

    // Überprüfe, ob bereits eine Person mit demselben Listenplatz in derselben Liste existiert
    let bereitsVorhanden = allePersonen.some(p => p.listenplatz === listenplatz && p.liste === liste);
    if (bereitsVorhanden) {
        alert('Eine Person mit diesem Listenplatz in dieser Liste existiert bereits.');
        return; // Beende die Funktion, wenn die Person bereits existiert
    }

    // Neue Person erstellen
    let neuePerson = new Person(ordentlich, liste, listenplatz, geschlecht, name, email, anwesend);

    // Füge die neue Person zum gemeinsamen Array hinzu
    allePersonen.push(neuePerson);

    // Personen im localStorage speichern
    speicherePersonen(allePersonen);

    // Aktualisiere die Tabelle, um die neue Person anzuzeigen
    displayPersonen();

    // Formular zurücksetzen
    document.getElementById("personenForm").reset();
});


export function loescheAlleListen() {
    // Lösche die Daten im localStorage
    localStorage.removeItem('allePersonen'); // Entfernt die gesamte Personenliste

    // Leere das Array im Programm
    allePersonen = [];

    // Aktualisiere die Anzeige
    displayPersonen();

    console.log('Alle Listeneinträge wurden erfolgreich gelöscht.');
}

