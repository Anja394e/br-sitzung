// form.js
import { Person, ordentliche_mitglieder, ersatz_personen, speicherePersonen } from './person.js';  // Import der notwendigen Variablen und Funktionen
import { displayPersonen } from './ui.js';  // Import der displayPersonen Funktion aus ui.js

// Event Listener für das Formular
document.getElementById("personenForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Verhindert das Standardverhalten des Formulars

    // Werte aus dem Formular abrufen
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let geschlecht = document.getElementById("geschlecht").value;
    let liste = parseInt(document.getElementById("liste").value);
    let anwesend = document.getElementById("anwesend").checked;
    let listenplatz = parseInt(document.getElementById("listenplatz").value);

    // Überprüfe, ob die Kombination aus Listenplatz und Liste bereits existiert
    let bereitsVorhanden = false;
    if (liste === 1) {
        bereitsVorhanden = ordentliche_mitglieder.some(p => p.listenplatz === listenplatz);
    } else {
        bereitsVorhanden = ersatz_personen.some(p => p.listenplatz === listenplatz);
    }

    if (bereitsVorhanden) {
        alert('Eine Person mit diesem Listenplatz existiert bereits in der ausgewählten Liste.');
        return; // Verhindert das Hinzufügen der Person
    }

    // Neue Person erstellen
    let neuePerson = new Person(liste, listenplatz, geschlecht, name, email, anwesend);

    // Die neue Person zur entsprechenden Liste hinzufügen
    if (liste === 1) {
        ordentliche_mitglieder.push(neuePerson);
    } else {
        ersatz_personen.push(neuePerson);
    }

    // Speichere die Personenlisten im localStorage
    speicherePersonen(ordentliche_mitglieder, ersatz_personen);

    // Aktualisiere die Tabellen
    displayPersonen();

    // Setze das Formular zurück
    document.getElementById("personenForm").reset();

    // Setze den nächsten freien Listenplatz nach dem Zurücksetzen
    setzeNaechstenFreienListenplatz(liste);
});

// Funktion zum Berechnen und Eintragen des nächsten freien Listenplatzes
function setzeNaechstenFreienListenplatz(liste) {
    let naechsterListenplatz;
    
    if (liste === 1) {
        // Höchster Listenplatz in der Liste der ordentlichen Mitglieder
        if (ordentliche_mitglieder.length > 0) {
            let hoechsterListenplatz = Math.max(...ordentliche_mitglieder.map(p => p.listenplatz));
            naechsterListenplatz = hoechsterListenplatz + 1;
        } else {
            naechsterListenplatz = 1; // Start bei 1, falls die Liste leer ist
        }
    } else {
        // Höchster Listenplatz in der Liste der Ersatzpersonen
        if (ersatz_personen.length > 0) {
            let hoechsterListenplatz = Math.max(...ersatz_personen.map(p => p.listenplatz));
            naechsterListenplatz = hoechsterListenplatz + 1;
        } else {
            naechsterListenplatz = 1; // Start bei 1, falls die Liste leer ist
        }
    }

    // Setze den Listenplatz im Formular
    document.getElementById("listenplatz").value = naechsterListenplatz;
}

// Automatisch den freien Listenplatz beim Laden des Formulars setzen
document.getElementById("liste").addEventListener("change", function () {
    let liste = parseInt(this.value);
    setzeNaechstenFreienListenplatz(liste);
});

// Setze den Listenplatz initial beim Laden der Seite
window.onload = function () {
    let liste = parseInt(document.getElementById("liste").value);
    setzeNaechstenFreienListenplatz(liste);
};

