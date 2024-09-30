import { loeschenPerson, bearbeitenPerson } from './person.js';
import { loescheAlleListen } from './person.js';
import { eingeladene_personen } from './ersatzmanagement.js';  // Importiere die eingeladene_personen Funktion

// Event Listener für den "Alle Listen löschen"-Button
document.getElementById("deleteAllButton").addEventListener('click', () => {
    // Bestätigungsdialog anzeigen
    const confirmation = confirm("Möchten Sie wirklich alle Einträge löschen?");
    
    // Überprüfe, ob der Benutzer auf "Ja" geklickt hat
    if (confirmation) {
        loescheAlleListen(); // Rufe die Funktion auf, um die Listen zu löschen
        alert("Alle Einträge wurden gelöscht."); // Optional: Nachricht, dass die Einträge gelöscht wurden
    } else {
        console.log("Löschvorgang abgebrochen.");
    }
});



// Funktion zum Hinzufügen der Event Listener für die Tabellen
export function addEventListeners() {
    // Event Delegation für das Klicken in der gemeinsamen Tabelle für alle Personen
    document.getElementById("personenTabelle").addEventListener('click', (event) => {
        const target = event.target; // Erfasse das angeklickte Element

        // Prüfe, ob der Bearbeiten-Button geklickt wurde
        if (target.classList.contains('editButton')) {
            // Hole die ID der Person aus den Datenattributen
            const personId = target.getAttribute('data-id');
            console.log(`Bearbeiten-Button geklickt: id=${personId}`);
            
            // Rufe die Bearbeiten-Funktion auf und übergebe die ID der Person
            bearbeitenPerson(personId);
        }

        // Prüfe, ob der Löschen-Button geklickt wurde
        if (target.classList.contains('deleteButton')) {
            // Hole die ID der Person aus den Datenattributen
            const personId = target.getAttribute('data-id');
            console.log(`Löschen-Button geklickt: id=${personId}`);
            
            // Rufe die Löschfunktion auf und übergebe die ID der Person
            loeschenPerson(personId);
        }
    });

    // Event Listener für den "Einladen"-Button
    document.getElementById("einladenButton").addEventListener('click', () => {
        console.log("Einladen-Button geklickt");

        // Hole die eingeladenen Personen mit der Funktion eingeladene_personen
        let { eingeladen, nachgeladen_fuer } = eingeladene_personen(allePersonen);

        // Zeige die eingeladenen Personen an
        displayEingeladenePersonen(eingeladen);

        // Mache das Ergebnisfeld sichtbar
        document.getElementById("ergebnisContainer").style.display = 'block';
    });

    // Event Listener für den Einstellungen-Button
    document.getElementById("einstellungenButton").addEventListener('click', () => {
        console.log("Einstellungen-Button geklickt");
        // Weiterleitung zur Einstellungsseite
        window.location.href = 'einstellungen.html';
    });
}

// Funktion zum Anzeigen der eingeladenen Personen
function displayEingeladenePersonen(personenListe) {
    const ul = document.getElementById("eingeladenePersonen");
    ul.innerHTML = ''; // Leere die Liste

    personenListe.forEach(person => {
        const li = document.createElement("li");
        li.textContent = person.name; // Zeige den Namen der eingeladenen Person an
        ul.appendChild(li);
    });
}
