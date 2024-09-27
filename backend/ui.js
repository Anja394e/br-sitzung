import { validierePerson } from "../backend/validation.js";
import { ordentliche_mitglieder, ersatz_personen, bearbeitenPerson, loeschenPerson } from './person.js';
import { addEventListeners } from './eventListeners.js';

// Funktion zum Anzeigen der eingeladenen Personen im HTML
export function displayEingeladenePersonen(eingeladen, nachgeladen_fuer) {
    let ergebnisListe = document.getElementById("eingeladenePersonen");
    ergebnisListe.innerHTML = ""; // Leeren der Ergebnisliste

    // Durch die eingeladenen Personen iterieren und sie in der HTML-Liste anzeigen
    eingeladen.forEach(person => {
        let li = document.createElement("li");
        let nachgeladenText = nachgeladen_fuer[person.name] ? ` (nachgeladen für ${nachgeladen_fuer[person.name]})` : '';
        li.textContent = `${person.name} (Listenplatz: ${person.listenplatz}, ${person.geschlecht.toUpperCase()})${nachgeladenText}`;
        ergebnisListe.appendChild(li); // Füge die Person der HTML-Liste hinzu
    });
}

// Funktion zum Anzeigen der Personen
export function displayPersonen() {
    let ordentlicheTabelle = document.getElementById("ordentlicheMitglieder");
    let ersatzTabelle = document.getElementById("ersatzPersonen");

    // Leere die Tabellen
    ordentlicheTabelle.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Geschlecht</th>
            <th>Anwesend</th>
            <th>Listenplatz</th>
            <th>Aktionen</th>
        </tr>
    `;
    ersatzTabelle.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Geschlecht</th>
            <th>Anwesend</th>
            <th>Listenplatz</th>
            <th>Aktionen</th>
        </tr>
    `;

    // Zeige ordentliche Mitglieder in der Tabelle
    ordentliche_mitglieder.forEach((person, index) => {
        let row = ordentlicheTabelle.insertRow();
        row.innerHTML = `
            <td>${person.name}</td>
            <td>${person.geschlecht}</td>
            <td>${person.anwesend ? 'Ja' : 'Nein'}</td>
            <td>${person.listenplatz}</td>
            <td>
                <button class="editButton" data-index="${index}" data-liste="1">Bearbeiten</button>
                <button class="deleteButton" data-index="${index}" data-liste="1">Löschen</button>
            </td>
        `;
    });

    // Zeige Ersatzpersonen in der Tabelle
    ersatz_personen.forEach((person, index) => {
        let row = ersatzTabelle.insertRow();
        row.innerHTML = `
            <td>${person.name}</td>
            <td>${person.geschlecht}</td>
            <td>${person.anwesend ? 'Ja' : 'Nein'}</td>
            <td>${person.listenplatz}</td>
            <td>
                <button class="editButton" data-index="${index}" data-liste="2">Bearbeiten</button>
                <button class="deleteButton" data-index="${index}" data-liste="2">Löschen</button>
            </td>
        `;
    });

    // Füge Event Listener für die Buttons erneut hinzu
    addEventListeners();
}

// Rufe displayPersonen() automatisch beim Laden der Seite auf
window.onload = function() {
    displayPersonen(); // Ruft die Funktion auf, um die Personen anzuzeigen
};
