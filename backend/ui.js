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

// Funktion zum Anzeigen der Personen (sortiert nach Listenplätzen)
export function displayPersonen() {
    // Referenziere eine kombinierte Tabelle für ordentliche Mitglieder und Ersatzpersonen
    let personenTabelle = document.getElementById("personenTabelle");

    // Leere die Tabelleninhalte und setze die Header für die Tabelle
    personenTabelle.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Geschlecht</th>
            <th>Anwesend</th>
            <th>Listenplatz</th>
            <th>Typ</th> <!-- Neue Spalte für den Typ -->
            <th>Aktionen</th>
        </tr>
    `;

    // Kombinierte Funktion, um sowohl ordentliche Mitglieder als auch Ersatzpersonen anzuzeigen
    const allePersonen = [...ordentliche_mitglieder, ...ersatz_personen];

    // Sortiere die Personen nach Listenplätzen
    allePersonen.sort((a, b) => a.listenplatz - b.listenplatz);

    // Zeige alle Personen in der Tabelle (ordentliche und Ersatzpersonen)
    allePersonen.forEach((person) => {
        let row = personenTabelle.insertRow();

        // Bestimme den Typ der Person (1 = Ordentlich, 2 = Ersatz)
        let typ = ordentliche_mitglieder.includes(person) ? 'Ordentlich' : 'Ersatz';

        // Fülle die Zellen der Zeile mit den Personendaten
        row.innerHTML = `
            <td>${person.name}</td>
            <td>${person.geschlecht}</td>
            <td>${person.anwesend ? 'Ja' : 'Nein'}</td>
            <td>${person.listenplatz}</td>
            <td>${typ}</td> <!-- Zeige den Typ der Person (Ordentlich oder Ersatz) -->
            <td>
                <!-- Setze den Listenplatz und die Liste als Datenattribute für die Bearbeiten/Löschen-Schaltflächen -->
                <button class="editButton" data-id="${person.id}">Bearbeiten</button>
                <button class="deleteButton" data-id="${person.id}">Löschen</button>
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
