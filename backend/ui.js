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

// Code zum Füllen der Tabellen mit ordentlichen Mitgliedern und Ersatzpersonen
function displayPersonen() {
    let ordentlicheTabelle = document.getElementById("ordentlicheMitglieder");
    let ersatzTabelle = document.getElementById("ersatzPersonen");

    // Leere die Tabellen
    ordentlicheTabelle.innerHTML = `<tr><th>Name</th><th>Geschlecht</th><th>Anwesend</th><th>Listenplatz</th><th>Aktionen</th></tr>`;
    ersatzTabelle.innerHTML = `<tr><th>Name</th><th>Geschlecht</th><th>Anwesend</th><th>Listenplatz</th><th>Aktionen</th></tr>`;

    // Zeige ordentliche Mitglieder
    ordentliche_mitglieder.forEach((person, index) => {
        let row = ordentlicheTabelle.insertRow();
        row.innerHTML = `<td>${person.name}</td><td>${person.geschlecht}</td><td>${person.anwesend ? 'Ja' : 'Nein'}</td><td>${person.listenplatz}</td><td><button onclick="bearbeitenPerson(${index}, 1)">Bearbeiten</button> <button onclick="loeschenPerson(${index}, 1)">Löschen</button></td>`;
    });

    // Zeige Ersatzpersonen
    ersatz_personen.forEach((person, index) => {
        let row = ersatzTabelle.insertRow();
        row.innerHTML = `<td>${person.name}</td><td>${person.geschlecht}</td><td>${person.anwesend ? 'Ja' : 'Nein'}</td><td>${person.listenplatz}</td><td><button onclick="bearbeitenPerson(${index}, 2)">Bearbeiten</button> <button onclick="loeschenPerson(${index}, 2)">Löschen</button></td>`;
    });
}
