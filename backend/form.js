document.getElementById("personenForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Verhindert das Standardverhalten des Formulars

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let geschlecht = document.getElementById("geschlecht").value;
    let liste = parseInt(document.getElementById("liste").value);
    let anwesend = document.getElementById("anwesend").checked;
    let listenplatz = parseInt(document.getElementById("listenplatz").value);

    let neuePerson = new Person(liste, listenplatz, geschlecht, name, email, anwesend);

    if (liste === 1) {
        ordentliche_mitglieder.push(neuePerson);
    } else {
        ersatz_personen.push(neuePerson);
    }

    // Speicher die Personenlisten im localStorage
    speicherePersonen(ordentliche_mitglieder, ersatz_personen);

    // Tabellen aktualisieren
    displayPersonen();

    // Formular zurücksetzen
    document.getElementById("personenForm").reset();
});
