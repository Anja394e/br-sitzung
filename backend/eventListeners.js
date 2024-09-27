import { loeschenPerson, bearbeitenPerson } from './person.js';

// Funktion zum Hinzufügen der Event Listener für die Tabellen
export function addEventListeners() {
    // Event Delegation für das Klicken in der Tabelle der ordentlichen Mitglieder
    document.getElementById("ordentlicheMitglieder").addEventListener('click', (event) => {
        const target = event.target; // Erfasse das angeklickte Element
        console.log("Button clicked in ordentlicheMitglieder");

        // Prüfe, ob der Bearbeiten-Button geklickt wurde
        if (target.classList.contains('editButton')) {
            // Hole den Listenplatz und die Liste aus den Datenattributen
            const listenplatz = target.getAttribute('data-listenplatz');
            const liste = target.getAttribute('data-liste'); // '1' für ordentliche Mitglieder, '2' für Ersatzpersonen
            console.log(`Bearbeiten-Button geklickt: listenplatz=${listenplatz}, liste=${liste}`);
            
            // Rufe die Bearbeiten-Funktion auf und übergebe den Listenplatz und die Liste
            bearbeitenPerson(listenplatz, liste);
        }

        // Prüfe, ob der Löschen-Button geklickt wurde
        if (target.classList.contains('deleteButton')) {
            // Hole den Listenplatz und die Liste aus den Datenattributen
            const listenplatz = target.getAttribute('data-listenplatz');
            const liste = target.getAttribute('data-liste');
            console.log(`Löschen-Button geklickt: listenplatz=${listenplatz}, liste=${liste}`);
            
            // Rufe die Löschfunktion auf und übergebe den Listenplatz und die Liste
            loeschenPerson(listenplatz, liste);
        }
    });

    // Event Delegation für das Klicken in der Tabelle der Ersatzpersonen
    document.getElementById("ersatzPersonen").addEventListener('click', (event) => {
        const target = event.target; // Erfasse das angeklickte Element
        console.log("Button clicked in ersatzPersonen");

        // Prüfe, ob der Bearbeiten-Button geklickt wurde
        if (target.classList.contains('editButton')) {
            // Hole den Listenplatz und die Liste aus den Datenattributen
            const listenplatz = target.getAttribute('data-listenplatz');
            const liste = target.getAttribute('data-liste'); // '1' für ordentliche Mitglieder, '2' für Ersatzpersonen
            console.log(`Bearbeiten-Button geklickt: listenplatz=${listenplatz}, liste=${liste}`);
            
            // Rufe die Bearbeiten-Funktion auf und übergebe den Listenplatz und die Liste
            bearbeitenPerson(listenplatz, liste);
        }

        // Prüfe, ob der Löschen-Button geklickt wurde
        if (target.classList.contains('deleteButton')) {
            // Hole den Listenplatz und die Liste aus den Datenattributen
            const listenplatz = target.getAttribute('data-listenplatz');
            const liste = target.getAttribute('data-liste');
            console.log(`Löschen-Button geklickt: listenplatz=${listenplatz}, liste=${liste}`);
            
            // Rufe die Löschfunktion auf und übergebe den Listenplatz und die Liste
            loeschenPerson(listenplatz, liste);
        }
    });

    // Event Listener für den "Einladen"-Button
    document.getElementById("einladenButton").addEventListener('click', () => {
        console.log("Einladen-Button geklickt");
        // Holen der eingeladenen Personen und deren Listen
        let { eingeladen, nachgeladen_fuer } = eingeladene_personen(ordentliche_mitglieder, ersatz_personen);
        
        // Zeige die eingeladenen Personen an
        displayEingeladenePersonen(eingeladen, nachgeladen_fuer);
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
