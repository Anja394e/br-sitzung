let geschlechtsanteil_w = localStorage.getItem("geschlechtsanteil_w") ? parseInt(localStorage.getItem("geschlechtsanteil_w")) : 2;

// Personenlisten initialisieren
let ordentliche_mitglieder = JSON.parse(localStorage.getItem("ordentliche_mitglieder")) || [];
let ersatz_personen = JSON.parse(localStorage.getItem("ersatz_personen")) || [];

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

    // Berechnet die Anzahl der weiblichen Personen unter den eingeladenen Personen
    function anzahl_weiblich() {
        return eingeladen.filter(person => person.geschlecht === 'w').length;
    }

    // Sucht eine Ersatzperson eines bestimmten Geschlechts
    function finde_ersatzperson(geschlecht) {
        return ersatz_personen.find(ersatz => ersatz.geschlecht === geschlecht && !eingeladen.includes(ersatz) && ersatz.anwesend);
    }

    // Sucht eine beliebige anwesende Ersatzperson (wenn keine weiblichen Personen mehr verfügbar sind)
    function finde_beliebige_ersatzperson() {
        return ersatz_personen.find(ersatz => !eingeladen.includes(ersatz) && ersatz.anwesend);
    }

    // Entfernt die zuletzt hinzugefügte männliche oder divers geschlechtliche Ersatzperson, um Platz für eine weibliche Person zu schaffen
    function entferne_letzte_maennliche_person() {
        for (let i = eingeladen.length - 1; i >= 0; i--) {
            if ((eingeladen[i].geschlecht === 'm' || eingeladen[i].geschlecht === 'd') && eingeladen[i].liste === 2) {
                return eingeladen.splice(i, 1)[0]; // Entfernen und Rückgabe der entfernten Person
            }
        }
        return null; // Keine männliche oder divers geschlechtliche Person zum Entfernen gefunden
    }

    // Zunächst werden alle anwesenden ordentlichen Mitglieder eingeladen
    ordentliche_mitglieder.forEach(person => {
        if (person.anwesend) {
            eingeladen.push(person);
        }
    });

    // Für jede nicht anwesende Person wird eine Ersatzperson gesucht
    ordentliche_mitglieder.forEach(person => {
        if (!person.anwesend) {
            let ersatz = finde_ersatzperson('m') || finde_ersatzperson('w') || finde_ersatzperson('d');
            if (ersatz && !eingeladen.includes(ersatz)) {
                eingeladen.push(ersatz);
                nachgeladen_fuer[ersatz.name] = person.name; // Speichern, für wen die Person nachgeladen wurde
            }
        }
    });

    // Maximal 10 Versuche, um die Mindestanzahl an weiblichen Personen zu erreichen (Vermeidung von Endlosschleifen)
    let versuche = 0;

    // Überprüfen, ob die Mindestanzahl an weiblichen Personen erreicht ist
    while (anzahl_weiblich() < geschlechtsanteil_w) {
        versuche++;
        if (versuche > 10) {
            console.log("Maximale Anzahl an Versuchen erreicht. Schleife wird abgebrochen.");
            break;
        }

        let entfernte_person = entferne_letzte_maennliche_person();
        if (entfernte_person) {
            let weibliche_ersatz = finde_ersatzperson('w');
            if (weibliche_ersatz) {
                eingeladen.push(weibliche_ersatz);
                nachgeladen_fuer[weibliche_ersatz.name] = "Minderheitengeschlecht"; // Kennzeichnen, warum diese Person nachgeladen wurde
            } else {
                // Wenn keine weibliche Person mehr vorhanden ist, lade eine beliebige Ersatzperson ein
                let beliebige_ersatz = finde_beliebige_ersatzperson();
                if (beliebige_ersatz) {
                    eingeladen.push(beliebige_ersatz);
                    nachgeladen_fuer[beliebige_ersatz.name] = "Keine weiteren Frauen verfügbar"; // Kennzeichnen, warum diese Person nachgeladen wurde
                } else {
                    console.log("Keine weiteren Ersatzpersonen verfügbar");
                    break; // Abbruch der Schleife, da keine Personen mehr verfügbar sind
                }
            }
        } else {
            console.log("Keine weiteren männlichen oder divers geschlechtlichen Ersatzpersonen zum Entfernen verfügbar");
            break; // Abbruch der Schleife, da keine männlichen Personen zum Entfernen vorhanden sind
        }
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
        li.textContent = `${person.name} (${person.geschlecht.toUpperCase()})${nachgeladenText}`;
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
    ordentlicheTabelle.innerHTML = `<tr><th>Name</th><th>Geschlecht</th><th>Anwesend</th><th>Aktionen</th></tr>`;
    ersatzTabelle.innerHTML = `<tr><th>Name</th><th>Geschlecht</th><th>Anwesend</th><th>Aktionen</th></tr>`;

    // Zeige ordentliche Mitglieder
    ordentliche_mitglieder.forEach((person, index) => {
        let row = ordentlicheTabelle.insertRow();
        row.innerHTML = `<td>${person.name}</td><td>${person.geschlecht}</td><td>${person.anwesend ? 'Ja' : 'Nein'}</td><td><button onclick="bearbeitenPerson(${index}, 1)">Bearbeiten</button> <button onclick="loeschenPerson(${index}, 1)">Löschen</button></td>`;
    });

    // Zeige Ersatzpersonen
    ersatz_personen.forEach((person, index) => {
        let row = ersatzTabelle.insertRow();
        row.innerHTML = `<td>${person.name}</td><td>${person.geschlecht}</td><td>${person.anwesend ? 'Ja' : 'Nein'}</td><td><button onclick="bearbeitenPerson(${index}, 2)">Bearbeiten</button> <button onclick="loeschenPerson(${index}, 2)">Löschen</button></td>`;
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

    let neuePerson = new Person(liste, `${liste === 1 ? ordentliche_mitglieder.length + 1 : ersatz_personen.length + 1}`, geschlecht, name, email, anwesend);

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
