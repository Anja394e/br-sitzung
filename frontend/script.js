let geschlechtsanteil_w = localStorage.getItem("geschlechtsanteil_w") ? parseInt(localStorage.getItem("geschlechtsanteil_w")) : 2;

// Personenlisten initialisieren
let ordentliche_mitglieder = JSON.parse(localStorage.getItem("ordentliche_mitglieder")) || [];
let ersatz_personen = JSON.parse(localStorage.getItem("ersatz_personen")) || [];

// Sucht die männliche Ersatzperson mit dem höchsten Listenplatz
function finde_hoechste_maennliche_ersatzperson() {
    return eingeladen
        .filter(person => person.geschlecht === 'm' && person.liste === 2) // Nur Ersatzpersonen (Liste 2) und männlich
        .sort((a, b) => b.listenplatz - a.listenplatz)[0]; // Höchster Listenplatz zuerst
}

// Sucht die weibliche Ersatzperson mit dem niedrigsten Listenplatz
function finde_niedrigste_weibliche_ersatzperson() {
    return ersatz_personen
        .filter(person => person.geschlecht === 'w' && !eingeladen.includes(person) && person.anwesend) // Nur weibliche, die noch nicht eingeladen sind
        .sort((a, b) => a.listenplatz - b.listenplatz)[0]; // Niedrigster Listenplatz zuerst
}

class Person {
    constructor(liste, listenplatz, geschlecht, name, mail, anwesend) {
        this.liste = liste;
        this.listenplatz = listenplatz;
        this.geschlecht = geschlecht;
        this.name = name;
        this.mail = mail;
        this.anwesend = anwesend;
    }

    toString() {
        return `Person(Liste: ${this.liste}, Listenplatz: ${this.listenplatz}, Geschlecht: ${this.geschlecht}, Name: ${this.name}, E-Mail: ${this.mail}, Anwesend: ${this.anwesend})`;
    }
}

// Funktion, um die eingeladenen Personen zu ermitteln
function eingeladene_personen(ordentliche_mitglieder, ersatz_personen) {
    let eingeladen = []; // Liste der final eingeladenen Personen
    let nachgeladen_fuer = {}; // Dictionary, um nachzuhalten, für wen eine Ersatzperson nachgeladen wurde
    let fehlende_mitglieder = ordentliche_mitglieder.filter(person => !person.anwesend).length; // Anzahl der nicht anwesenden ordentlichen Mitglieder

    // Ersatzpersonen nach Listenplatz sortieren (niedrigster Listenplatz zuerst)
    ersatz_personen.sort((a, b) => a.listenplatz - b.listenplatz);

    // Berechnet die Anzahl der weiblichen Personen unter den eingeladenen Personen
    function anzahl_weiblich() {
        return eingeladen.filter(person => person.geschlecht === 'w').length;
    }

    // Sucht die Ersatzperson mit dem niedrigsten Listenplatz (beliebiges Geschlecht)
    function finde_beliebige_ersatzperson() {
        return ersatz_personen
            .filter(ersatz => !eingeladen.includes(ersatz) && ersatz.anwesend)
            .sort((a, b) => a.listenplatz - b.listenplatz)[0]; // Person mit niedrigstem Listenplatz zuerst
    }

    // Zunächst werden alle anwesenden ordentlichen Mitglieder eingeladen
    ordentliche_mitglieder.forEach(person => {
        if (person.anwesend) {
            eingeladen.push(person);
        }
    });

    // Für jede nicht anwesende Person wird eine Ersatzperson nachgeladen (niedrigster Listenplatz zuerst)
    ordentliche_mitglieder.forEach(person => {
    if (!person.anwesend) {
        let ersatz;
        do {
            ersatz = finde_beliebige_ersatzperson();
        } while (ersatz && eingeladen.includes(ersatz)); // Wiederholen, bis eine nicht eingeladene Ersatzperson gefunden wird

        if (ersatz) {
            eingeladen.push(ersatz);
            nachgeladen_fuer[ersatz.name] = person.name; // Speichern, für wen die Person nachgeladen wurde
            fehlende_mitglieder--; // Reduziere die Anzahl fehlender Mitglieder
        } else {
            console.log("Keine Ersatzpersonen mehr verfügbar.");
        }
    }
});


   // Überprüfe, ob die Mindestanzahl an Frauen erreicht ist
while (anzahl_weiblich() < geschlechtsanteil_w) {
    let weibliche_ersatz = finde_niedrigste_weibliche_ersatzperson();

    // Wenn keine weibliche Ersatzperson verfügbar ist, beenden
    if (!weibliche_ersatz) {
        console.log("Keine weiblichen Ersatzpersonen mehr verfügbar.");
        break; // Keine weiteren weiblichen Ersatzpersonen verfügbar, Abbruch
    }

    // Finde die männliche Ersatzperson mit dem höchsten Listenplatz
    let maennliche_ersatz = finde_hoechste_maennliche_ersatzperson();
    if (!maennliche_ersatz) {
        console.log("Keine männlichen Ersatzpersonen mehr zum Entfernen verfügbar.");
        break; // Wenn keine männliche Person mehr zum Ersetzen verfügbar ist, abbrechen
    }

    // Entferne die männliche Ersatzperson und lade die weibliche nach
    eingeladen = eingeladen.filter(person => person !== maennliche_ersatz);
    eingeladen.push(weibliche_ersatz);

    // Hinzufügen eines Log-Eintrags, damit der Austausch korrekt angezeigt wird
    nachgeladen_fuer[weibliche_ersatz.name] = `ersetzt ${maennliche_ersatz.name}`;

    // Entferne die eingeladene weibliche Person aus der Ersatzliste
    ersatz_personen = ersatz_personen.filter(person => person !== weibliche_ersatz); 
}


    return { eingeladen, nachgeladen_fuer };
}

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


// Fülle die Tabellen
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

// Funktion zum Speichern der aktuellen Personenlisten im localStorage
function speicherePersonen() {
    localStorage.setItem("ordentliche_mitglieder", JSON.stringify(ordentliche_mitglieder));
    localStorage.setItem("ersatz_personen", JSON.stringify(ersatz_personen));
}

// Funktion zum Hinzufügen einer neuen Person
document.getElementById("personenForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let geschlecht = document.getElementById("geschlecht").value;
    let liste = parseInt(document.getElementById("liste").value);
    let anwesend = document.getElementById("anwesend").checked;
    let listenplatz = parseInt(document.getElementById("listenplatz").value); // Neue Listenposition

    let neuePerson = new Person(liste, listenplatz, geschlecht, name, email, anwesend);

    if (liste === 1) {
        ordentliche_mitglieder.push(neuePerson);
    } else {
        ersatz_personen.push(neuePerson);
    }

    // Personen in localStorage speichern
    speicherePersonen();

    // Aktualisiere die Tabelle
    displayPersonen();

    // Formular leeren
    document.getElementById("personenForm").reset();
});

// Funktion zum Bearbeiten einer Person
function bearbeitenPerson(index, liste) {
    let person = liste === 1 ? ordentliche_mitglieder[index] : ersatz_personen[index];

    document.getElementById("name").value = person.name;
    document.getElementById("email").value = person.mail;
    document.getElementById("geschlecht").value = person.geschlecht;
    document.getElementById("liste").value = person.liste;
    document.getElementById("anwesend").checked = person.anwesend;
    document.getElementById("listenplatz").value = person.listenplatz; // Listenposition wird gefüllt

    // Entferne die alte Person, damit die neue hinzugefügt werden kann
    loeschenPerson(index, liste);
}

// Funktion zum Löschen einer Person
function loeschenPerson(index, liste) {
    if (liste === 1) {
        ordentliche_mitglieder.splice(index, 1);
    } else {
        ersatz_personen.splice(index, 1);
    }

    // Personen in localStorage speichern
    speicherePersonen();

    // Aktualisiere die Tabelle
    displayPersonen();
}

// Starte mit dem Anzeigen der Personen
displayPersonen();
