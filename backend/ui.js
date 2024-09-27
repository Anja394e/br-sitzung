import { validierePerson } from "../backend/validation.js"; // Import der Validierungsfunktion
import { ordentliche_mitglieder } from './person.js';
import { ersatz_personen } from './person.js';
import { addEventListeners } from './eventListeners.js';


// Funktion zum Anzeigen der eingeladenen Personen im HTML
function displayEingeladenePersonen(eingeladen, nachgeladen_fuer) {
    let ergebnisListe = document.getElementById("eingeladenePersonen");
    ergebnisListe.innerHTML = ""; // Leeren der Ergebnisliste

    eingeladen.forEach(person => {
        let li = document.createElement("li");
        let nachgeladenText = nachgeladen_fuer[person.name] ? ` (nachgeladen für ${nachgeladen_fuer[person.name]})` : '';
        li.textContent = `${person.name} (Listenplatz: ${person.listenplatz}, ${person.geschlecht.toUpperCase()})${nachgeladenText}`;
        ergebnisListe.appendChild(li);
    });
}

// Event Listener für den "Einladen"-Button
document.getElementById("einladenButton").addEventListener("click", () => {
    let { eingeladen, nachgeladen_fuer } = eingeladene_personen(ordentliche_mitglieder, ersatz_personen);
    displayEingeladenePersonen(eingeladen, nachgeladen_fuer);

    // Ergebnisbereich anzeigen
    document.getElementById("ergebnisContainer").style.display = 'block';
});

export function displayPersonen() {
    let ordentlicheTabelle = document.getElementById("ordentlicheMitglieder");
    let ersatzTabelle = document.getElementById("ersatzPersonen");

    // Leere die Tabellen und füge die Kopfzeilen hinzu
    ordentlicheTabelle.innerHTML = `<tr><th>Name</th><th>Geschlecht</th><th>Anwesend</th><th>Listenplatz</th><th>Aktionen</th></tr>`;
    ersatzTabelle.innerHTML = `<tr><th>Name</th><th>Geschlecht</th><th>Anwesend</th><th>Listenplatz</th><th>Aktionen</th></tr>`;

    // Zeige ordentliche Mitglieder
    // Für jedes ordentliche Mitglied wird eine neue Zeile (row) in der Tabelle erstellt
    ordentliche_mitglieder.forEach((person, index) => {
        let row = ordentlicheTabelle.insertRow(); // Neue Zeile einfügen
        row.innerHTML = `
            <td>${person.name}</td>   <!-- Name der Person -->
            <td>${person.geschlecht}</td>  <!-- Geschlecht der Person -->
            <td>${person.anwesend ? 'Ja' : 'Nein'}</td>  <!-- Anwesenheitsstatus der Person -->
            <td>${person.listenplatz}</td>  <!-- Listenplatz der Person -->
            <td>
                <!-- Bearbeiten-Button mit CSS-Klasse und data-Attributen -->
                <button class="bearbeitenButton" data-index="${index}" data-liste="1">Bearbeiten</button>
                <!-- Löschen-Button mit CSS-Klasse und data-Attributen -->
                <button class="loeschenButton" data-index="${index}" data-liste="1">Löschen</button>
            </td>
        `;
    });

    // Zeige Ersatzpersonen
    // Für jede Ersatzperson wird eine neue Zeile (row) in der Tabelle erstellt
    ersatz_personen.forEach((person, index) => {
        let row = ersatzTabelle.insertRow(); // Neue Zeile einfügen
        row.innerHTML = `
            <td>${person.name}</td>   <!-- Name der Person -->
            <td>${person.geschlecht}</td>  <!-- Geschlecht der Person -->
            <td>${person.anwesend ? 'Ja' : 'Nein'}</td>  <!-- Anwesenheitsstatus der Person -->
            <td>${person.listenplatz}</td>  <!-- Listenplatz der Person -->
            <td>
                <!-- Bearbeiten-Button mit CSS-Klasse und data-Attributen -->
                <button class="bearbeitenButton" data-index="${index}" data-liste="2">Bearbeiten</button>
                <!-- Löschen-Button mit CSS-Klasse und data-Attributen -->
                <button class="loeschenButton" data-index="${index}" data-liste="2">Löschen</button>
            </td>
        `;
    });

// Rufe displayPersonen() automatisch beim Laden der Seite auf
window.onload = function() {
    displayPersonen(); // Ruft die Funktion auf, um die Personen anzuzeigen
    addEventListeners(); // Fügt die Event Listener hinzu, um die Bearbeiten- und Löschen-Buttons interaktiv zu machen
};

