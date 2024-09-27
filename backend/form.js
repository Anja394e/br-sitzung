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
});
