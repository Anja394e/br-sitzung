// person.js

import { displayPersonen } from './ui.js';


// Personenlisten initialisieren
export let ordentliche_mitglieder = JSON.parse(localStorage.getItem("ordentliche_mitglieder") || "[]";
export let ersatz_personen = JSON.parse(localStorage.getItem("ersatz_personen") || "[]";

// Klasse Person zur Definition der Personen
export class Person {
    constructor(liste, listenplatz, geschlecht, name, mail, anwesend) {
        this.liste = liste;
        this.listenplatz = listenplatz;
        this.geschlecht = geschlecht;
        this.name = name;
        this.mail = mail;
        this.anwesend = anwesend;
    }

    toString() {
        return `Person(Liste: ${this.liste}, Listenplatz: ${this.listenplatz}, Geschlecht: ${this.geschlecht}, Name: ${this.name}, E-Mail: ${this.mail}, Anwesend: ${this.anwesend})`;
    }
}

// Funktion zum Speichern der aktuellen Personenlisten im localStorage
export function speicherePersonen(ordentliche_mitglieder, ersatz_personen) {
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

    // Entferne die alte Person, damit die neue hinzugefügt werden kann
    loeschenPerson(index, liste);
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
document.getElementById("personenForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Verhindert das Neuladen der Seite

    // Hol die Werte aus dem Formular
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let geschlecht = document.getElementById("geschlecht").value;
    let liste = parseInt(document.getElementById("liste").value);
    let anwesend = document.getElementById("anwesend").checked;
    let listenplatz = parseInt(document.getElementById("listenplatz").value); // Neue Listenposition

    // Neue Person erstellen
    let neuePerson = new Person(liste, listenplatz, geschlecht, name, email, anwesend);

    // Füge die neue Person zur entsprechenden Liste hinzu
    if (liste === 1) {
        ordentliche_mitglieder.push(neuePerson); // Zu den ordentlichen Mitgliedern hinzufügen
    } else {
        ersatz_personen.push(neuePerson); // Zu den Ersatzpersonen hinzufügen
    }

    // Personen im localStorage speichern
    speicherePersonen();

    // Aktualisiere die Tabelle, um die neue Person anzuzeigen
    displayPersonen();

    // Event Listener für die Buttons erneut hinzufügen
    addEventListeners(); // Wichtiger Schritt!

    // Formular zurücksetzen
    document.getElementById("personenForm").reset();
});
