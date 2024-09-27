import { displayPersonen } from './ui.js';
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
    constructor(liste, listenplatz, geschlecht, name, mail, anwesend) {
        this.liste = liste;
        this.listenplatz = listenplatz;
        this.geschlecht = geschlecht;
        this.name = name;
        this.mail = mail;
        this.anwesend = anwesend;
    }

    // toString-Methode für die Person-Klasse
    toString() {
        return `Person(Liste: ${this.liste}, Listenplatz: ${this.listenplatz}, Geschlecht: ${this.geschlecht}, Name: ${this.name}, E-Mail: ${this.mail}, Anwesend: ${this.anwesend})`;
    }
}

// Funktion zum Speichern der aktuellen Personenlisten im localStorage
export function speicherePersonen() {
    localStorage.setItem("ordentliche_mitglieder", JSON.stringify(ordentliche_mitglieder));
    localStorage.setItem("ersatz_personen", JSON.stringify(ersatz_personen));
}

// Funktion zum Bearbeiten einer Person
export function bearbeitenPerson(index, liste) {
    let person = liste === 1 ? ordentliche_mitglieder[index] : ersatz_personen[index];

    document.getElementById("name").value = person.name;
    document.getElementById("email").value = person.mail;
    document.getElementById("geschlecht").value = person.geschlecht;
    document.getElementById("liste").value = person.liste;
    document.getElementById("anwesend").checked = person.anwesend;
    document.getElementById("listenplatz").value = person.listenplatz; // Listenposition wird gefüllt
}

// Funktion zum Löschen einer Person
export function loeschenPerson(index, liste) {
    if (liste === 1) {
        ordentliche_mitglieder.splice(index, 1);
    } else {
        ersatz_personen.splice(index, 1);
    }

    // Personen in localStorage speichern
    speicherePersonen();

    // Aktualisiere die Tabelle
    displayPersonen();
}

// Funktion zum Hinzufügen einer neuen Person
document.getElementById
import { displayPersonen } from './ui.js';
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
    constructor(liste, listenplatz, geschlecht, name, mail, anwesend) {
        this.liste = liste;
        this.listenplatz = listenplatz;
        this.geschlecht = geschlecht;
        this.name = name;
        this.mail = mail;
        this.anwesend = anwesend;
    }

    // toString-Methode für die Person-Klasse
    toString() {
        return `Person(Liste: ${this.liste}, Listenplatz: ${this.listenplatz}, Geschlecht: ${this.geschlecht}, Name: ${this.name}, E-Mail: ${this.mail}, Anwesend: ${this.anwesend})`;
    }
}

// Funktion zum Speichern der aktuellen Personenlisten im localStorage
export function speicherePersonen() {
    localStorage.setItem("ordentliche_mitglieder", JSON.stringify(ordentliche_mitglieder));
    localStorage.setItem("ersatz_personen", JSON.stringify(ersatz_personen));
}

// Funktion zum Bearbeiten einer Person
export function bearbeitenPerson(index, liste) {
    let person = liste === 1 ? ordentliche_mitglieder[index] : ersatz_personen[index];

    document.getElementById("name").value = person.name;
    document.getElementById("email").value = person.mail;
    document.getElementById("geschlecht").value = person.geschlecht;
    document.getElementById("liste").value = person.liste;
    document.getElementById("anwesend").checked = person.anwesend;
    document.getElementById("listenplatz").value = person.listenplatz; // Listenposition wird gefüllt
}

// Funktion zum Löschen einer Person
export function loeschenPerson(index, liste) {
    if (liste === 1) {
        ordentliche_mitglieder.splice(index, 1);
    } else {
        ersatz_personen.splice(index, 1);
    }

    // Personen in localStorage speichern
    speicherePersonen();

    // Aktualisiere die Tabelle
    displayPersonen();
}

// Funktion zum Hinzufügen einer neuen Person
document.getElementById
