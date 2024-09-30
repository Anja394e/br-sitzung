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

export function displayPersonen() {
    // Referenziere die kombinierte Tabelle für alle Personen
    let personenTabelle = document.getElementById("personenTabelle");

    // Leere die Tabelleninhalte und setze die Header für die Tabelle
    personenTabelle.innerHTML = `
        <tr>
            <th>Name</th>
            <th>Geschlecht</th>
            <th>Anwesend</th>
            <th>Listenplatz</th>
            <th>Ordentlich</th>
            <th>Liste</th>
            <th>Aktionen</th>
        </tr>
    `;

    // Sortiere die Personen nach 'ordentlich', dann 'liste', dann 'listenplatz'
    allePersonen.sort((a, b) => {
        // Sortiere zuerst nach 'ordentlich' (ordentliche Mitglieder kommen zuerst)
        if (a.ordentlich !== b.ordentlich) {
            return b.ordentlich - a.ordentlich;
        }
        // Sortiere nach 'liste' (z.B. Liste 1, Liste 2 usw.)
        if (a.liste !== b.liste) {
            return a.liste - b.liste;
        }
        // Sortiere nach 'listenplatz' innerhalb der Liste
        return a.listenplatz - b.listenplatz;
    });

    // Zeige alle Personen in der Tabelle an
    allePersonen.forEach((person) => {
        let row = personenTabelle.insertRow();

        // Fülle die Zellen der Zeile mit den Personendaten
        row.innerHTML = `
            <td>${person.name}</td>
            <td>${person.geschlecht}</td>
            <td>${person.anwesend ? 'Ja' : 'Nein'}</td>
            <td>${person.listenplatz}</td>
            <td>${person.ordentlich ? 'Ja' : 'Nein'}</td> <!-- Zeige, ob die Person ordentlich ist -->
            <td>${person.liste}</td> <!-- Zeige die Liste der Person -->
            <td>
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
