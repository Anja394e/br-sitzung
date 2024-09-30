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
    // Referenziere die Tabellen für ordentliche Mitglieder und Ersatzpersonen
    let ordentlicheTabelle = document.getElementById("ordentlicheMitglieder");
    let ersatzTabelle = document.getElementById("ersatzPersonen");

    // Leere die Tabelleninhalte und setze die Header für die Tabellen
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
    ordentliche_mitglieder.forEach((person) => {
        // Füge eine neue Zeile in die Tabelle der ordentlichen Mitglieder ein
        let row = ordentlicheTabelle.insertRow();

        // Fülle die Zellen der Zeile mit den Personendaten
        row.innerHTML = `
            <td>${person.name}</td>
            <td>${person.geschlecht}</td>
            <td>${person.anwesend ? 'Ja' : 'Nein'}</td>
            <td>${person.listenplatz}</td>
            <td>
                <!-- Setze den Listenplatz und die Liste als Datenattribute für die Bearbeiten/Löschen-Schaltflächen -->
                <button class="editButton" data-id="${person.id}">Bearbeiten</button>
                <button class="deleteButton" data-id="${person.id>Löschen</button>
            </td>
        `;
    });

    // Zeige Ersatzpersonen in der Tabelle
    ersatz_personen.forEach((person) => {
        // Füge eine neue Zeile in die Tabelle der Ersatzpersonen ein
        let row = ersatzTabelle.insertRow();

        // Fülle die Zellen der Zeile mit den Personendaten
        row.innerHTML = `
            <td>${person.name}</td>
            <td>${person.geschlecht}</td>
            <td>${person.anwesend ? 'Ja' : 'Nein'}</td>
            <td>${person.listenplatz}</td>
            <td>
                <!-- Setze den Listenplatz und die Liste als Datenattribute für die Bearbeiten/Löschen-Schaltflächen -->
                <button class="editButton" data-listenplatz="${person.listenplatz}" data-liste="2">Bearbeiten</button>
                <button class="deleteButton" data-listenplatz="${person.listenplatz}" data-liste="2">Löschen</button>
            </td>
        `;
    });

    // Füge die Event Listener für die Schaltflächen hinzu, nachdem die Zeilen dynamisch erstellt wurden
    addEventListeners();
}

// Rufe displayPersonen() automatisch beim Laden der Seite auf
window.onload = function() {
    displayPersonen(); // Ruft die Funktion auf, um die Personen anzuzeigen
};
