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

});
