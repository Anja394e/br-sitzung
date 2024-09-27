import { loeschenPerson, bearbeitenPerson } from './person.js';

// Funktion zum Hinzufügen der Event Listener für die Tabellen
export function addEventListeners() {
    // Event Delegation für das Klicken in der Tabelle der ordentlichen Mitglieder
    document.getElementById("ordentlicheMitglieder").addEventListener('click', (event) => {
        const target = event.target; // Das angeklickte Element
        console.log("Button clicked in ordentlicheMitglieder");

        // Prüfe, ob der Bearbeiten-Button geklickt wurde
        if (target.classList.contains('editButton')) {
            const index = target.getAttribute('data-index');
            const liste = target.getAttribute('data-liste');
            console.log(`Bearbeiten-Button geklickt: index=${index}, liste=${liste}`);
            bearbeitenPerson(index, liste); // Rufe die Bearbeiten-Funktion auf
        }

        // Prüfe, ob der Löschen-Button geklickt wurde
        if (target.classList.contains('deleteButton')) {
            const index = target.getAttribute('data-index');
            const liste = target.getAttribute('data-liste');
            console.log(`Löschen-Button geklickt: index=${index}, liste=${liste}`);
            loeschenPerson(index, liste); // Rufe die Löschfunktion auf
        }
    });

    // Event Delegation für das Klicken in der Tabelle der Ersatzpersonen
    document.getElementById("ersatzPersonen").addEventListener('click', (event) => {
        const target = event.target; // Das angeklickte Element
        console.log("Button clicked in ersatzPersonen");

        // Prüfe, ob der Bearbeiten-Button geklickt wurde
        if (target.classList.contains('editButton')) {
            const index = target.getAttribute('data-index');
            const liste = target.getAttribute('data-liste');
            console.log(`Bearbeiten-Button geklickt: index=${index}, liste=${liste}`);
            bearbeitenPerson(index, liste); // Rufe die Bearbeiten-Funktion auf
        }

        // Prüfe, ob der Löschen-Button geklickt wurde
        if (target.classList.contains('deleteButton')) {
            const index = target.getAttribute('data-index');
            const liste = target.getAttribute('data-liste');
            console.log(`Löschen-Button geklickt: index=${index}, liste=${liste}`);
            loeschenPerson(index, liste); // Rufe die Löschfunktion auf
        }
    });

    // Event Listener für den "Einladen"-Button
    document.getElementById("einladenButton").addEventListener('click', () => {
        console.log("Einladen-Button geklickt");
        let { eingeladen, nachgeladen_fuer } = eingeladene_personen(ordentliche_mitglieder, ersatz_personen);
        displayEingeladenePersonen(eingeladen, nachgeladen_fuer);
        document.getElementById("ergebnisContainer").style.display = 'block';
    });

    // Event Listener für den Einstellungen-Button
    document.getElementById("einstellungenButton").addEventListener('click', () => {
        console.log("Einstellungen-Button geklickt");
        window.location.href = 'einstellungen.html';
    });
}
