import { loeschenPerson, bearbeitenPerson } from './person.js';
import { eingeladene_personen } from './ersatzmanagement.js';
import { ordentliche_mitglieder, ersatz_personen } from './person.js';
import { displayEingeladenePersonen } from './ui.js';

// Funktion zum Hinzufügen der Event Listener
export function addEventListeners() {
    // Event Listener für Löschen-Buttons
    document.querySelectorAll('.loeschenButton').forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');
            const liste = event.target.getAttribute('data-liste');
            loeschenPerson(index, liste); // Ruft die Löschfunktion aus person.js auf
        });
    });

    // Event Listener für Bearbeiten-Buttons
    document.querySelectorAll('.bearbeitenButton').forEach(button => {
        button.addEventListener('click', (event) => {
            const index = event.target.getAttribute('data-index');
            const liste = event.target.getAttribute('data-liste');
            bearbeitenPerson(index, liste); // Ruft die Bearbeiten-Funktion aus person.js auf
        });
    });

    // Event Listener für den "Einladen"-Button
    document.getElementById("einladenButton").addEventListener('click', () => {
        // Berechne die eingeladenen Personen und die Personen, die ersetzt wurden
        let { eingeladen, nachgeladen_fuer } = eingeladene_personen(ordentliche_mitglieder, ersatz_personen);
        
        // Zeige die eingeladenen Personen in der UI an
        displayEingeladenePersonen(eingeladen, nachgeladen_fuer);

        // Zeige den Ergebnisbereich (die Liste der eingeladenen Personen) an
        document.getElementById("ergebnisContainer").style.display = 'block';
    });

    // Event Listener für den Einstellungen-Button
    document.getElementById("einstellungenButton").addEventListener('click', () => {
        window.location.href = 'einstellungen.html'; // Leitet den Benutzer zur Einstellungsseite weiter
    });
}
