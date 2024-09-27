import { loeschenPerson, bearbeitenPerson } from './person.js';

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
}

// Event Listener für den Einstellungen-Button
document.getElementById("einstellungenButton").addEventListener('click', () => {
    window.location.href = 'einstellungen.html'; // Leitet den Benutzer zur Einstellungsseite weiter
});
