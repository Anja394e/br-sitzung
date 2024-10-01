// Die Person-Klasse definieren und  ieren
  class Person {
    constructor(ordentlich, liste, listenplatz, geschlecht, name, mail, anwesend) {
        this.id = this.generateId();
        this.ordentlich = ordentlich;
        this.liste = liste;
        this.listenplatz = listenplatz;
        this.geschlecht = geschlecht;
        this.name = name;
        this.mail = mail;
        this.anwesend = anwesend;
    }

    // Generiere eine eindeutige ID
    generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    // Benutzerdefinierte toString()-Methode für die Textrepräsentation
    toString() {
        return `${this.name} (Listenplatz: ${this.listenplatz}, ${this.ordentlich ? 'Ordentlich' : 'Ersatz'}, Liste: ${this.liste}, Geschlecht: ${this.geschlecht}, Anwesend: ${this.anwesend ? 'Ja' : 'Nein'})`;
    }
}

  let allePersonen = [];
// Personen beim Start laden
allePersonen = ladePersonen();


// Funktion zum Speichern der Personenliste im localStorage
  function speicherePersonen(allePersonen) {
    localStorage.setItem("allePersonen", JSON.stringify(allePersonen));
}

// Funktion zum Laden der Personen aus dem localStorage
  function ladePersonen() {
    let personenRaw = localStorage.getItem("allePersonen");
    if (personenRaw) {
        return JSON.parse(personenRaw);
    }
    return [];
}



  function bearbeitenPerson(id) {
    // Suche die Person anhand der übermittelten ID im gemeinsamen Array 'allePersonen'
    let person = allePersonen.find(p => p.id === id);

    if (!person) {
        console.error('Person nicht gefunden mit ID:', id);
        return;  // Falls die Person nicht existiert, Funktion beenden
    }

    // Person existiert, nun die Formularfelder mit den Werten füllen
    document.getElementById("name").value = person.name;
    document.getElementById("email").value = person.mail;
    document.getElementById("geschlecht").value = person.geschlecht;
    document.getElementById("ordentlich").checked = person.ordentlich; // Neues Feld für ordentlich
    document.getElementById("liste").value = person.liste;
    document.getElementById("anwesend").checked = person.anwesend;
    document.getElementById("listenplatz").value = person.listenplatz;
}




// Funktion zum Löschen einer Person
  function loeschenPerson(id) {
    // Finde den Index der Person anhand der übermittelten ID
    const index = allePersonen.findIndex(p => p.id === id);

    if (index === -1) {
        console.error('Person nicht gefunden mit ID:', id);
        return;  // Falls die Person nicht existiert, Funktion beenden
    }

    // Person aus dem gemeinsamen Array entfernen
    allePersonen.splice(index, 1);

    // Personen in localStorage speichern
    speicherePersonen(allePersonen);

    // Aktualisiere die Tabelle
    displayPersonen();
}



// Listen aus dem localStorage laden oder initialisieren
let listen = [];
try {
    listen = JSON.parse(localStorage.getItem('listen')) || [];
} catch (e) {
    console.error("Fehler beim Laden der Listen aus dem localStorage:", e);
    listen = []; // Falls der localStorage-String ungültig ist, setze listen auf ein leeres Array
}


// Event Listener für das Formular
document.getElementById("personenForm").addEventListener("submit", function (e) {
    e.preventDefault(); // Verhindert das Standardverhalten des Formulars

    // Werte aus dem Formular abrufen
    let ordentlich = document.getElementById("ordentlich").checked;
    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let geschlecht = document.getElementById("geschlecht").value;
    let listenplatz = parseInt(document.getElementById("listenplatz").value);
    let anwesend = document.getElementById("anwesend").checked;

    // Überprüfung und Auswahl der Liste
    let vorhandeneListe = document.getElementById("liste").value;
    let neueListe = document.getElementById("neueListe").value;

    // Falls eine neue Liste eingegeben wurde, hat diese Vorrang
    let liste = neueListe ? neueListe : vorhandeneListe;

   //Überprüfe, ob eine Liste ausgewählt oder eingegeben wurde
    if (!liste) {
        alert('Bitte wählen Sie eine Liste aus oder geben Sie eine neue Liste ein.');
        return;
    }

    // Überprüfen, ob die Kombination aus Listenplatz und Liste bereits existiert
    let vorhandenePerson = allePersonen.find(p => p.listenplatz === listenplatz && p.liste === liste);

    if (vorhandenePerson) {
        // Bestätigungsdialog, ob die ursprüngliche Person ersetzt werden soll
        let bestaetigung = confirm(`Eine Person mit diesem Listenplatz (${listenplatz}) in der Liste (${liste}) existiert bereits. Möchten Sie den ursprünglichen durch den neuen Eintrag ersetzen?`);

        if (bestaetigung) {
            // Person durch die neue ersetzen
            vorhandenePerson.ordentlich = ordentlich;
            vorhandenePerson.name = name;
            vorhandenePerson.mail = email;
            vorhandenePerson.geschlecht = geschlecht;
            vorhandenePerson.anwesend = anwesend;

            // Speichern der aktualisierten Personenliste
            speicherePersonen(allePersonen);

            // Aktualisiere die Anzeige der Personen
            displayPersonen();

            alert(`Eintrag erfolgreich aktualisiert.`);
        } else {
            // Benutzer hat abgelehnt, nichts tun
            alert('Die Person wurde nicht ersetzt.');
        }
        return; // Formularverarbeitung hier beenden
    }

   // Falls keine Person mit diesem Listenplatz und dieser Liste existiert, neue Person erstellen
   let neuePerson = new Person(ordentlich, liste, listenplatz, geschlecht, name, email, anwesend);

    // Füge die neue Person zum gemeinsamen Array hinzu
    allePersonen.push(neuePerson);

    // Falls eine neue Liste erstellt wurde, füge sie zu den Listen hinzu
    if (neueListe && !listen.includes(neueListe)) {
        listen.push(neueListe);
        localStorage.setItem('listen', JSON.stringify(listen)); // Speichern der Listen im localStorage
        aktualisiereListenDropdown(); // Aktualisiere das Dropdown-Menü
    }

    // Personen im localStorage speichern
    speicherePersonen(allePersonen);

    // Aktualisiere die Tabelle, um die neue Person anzuzeigen
    displayPersonen();

    // Formular zurücksetzen
    document.getElementById("personenForm").reset();

    // Setze den nächsten freien Listenplatz
    setzeNaechstenFreienListenplatz(liste);
  
    setzeStandardwerte(); // Setze die Standardwerte, wenn auf den Button geklickt wird
  
});


  function loescheAlleListen() {
    // Lösche die Daten im localStorage
    localStorage.removeItem('allePersonen'); // Entfernt die gesamte Personenliste

    // Leere das Array im Programm
    allePersonen = [];

    // Aktualisiere die Anzeige
    displayPersonen();

    console.log('Alle Listeneinträge wurden erfolgreich gelöscht.');
}

// Funktion zum Anzeigen der Personen im HTML
function displayEingeladenePersonen(personenListe, nachgeladen_fuer = {}) {
    let ergebnisListe = document.getElementById("eingeladenePersonen");
    ergebnisListe.innerHTML = ""; // Leeren der Ergebnisliste

    // Durch die Personenliste iterieren und sie in der HTML-Liste anzeigen
    personenListe.forEach(person => {
        let li = document.createElement("li");
        
        // Überprüfe, ob die Person nachgeladen wurde und füge ggf. den Text hinzu
        let nachgeladenText = nachgeladen_fuer[person.name] ? ` (nachgeladen für ${nachgeladen_fuer[person.name]})` : '';
        
        // Erstelle die Textrepräsentation der Person
        li.textContent = `${person.name} (Listenplatz: ${person.listenplatz}, ${person.geschlecht.toUpperCase()})${nachgeladenText}`;
        
        // Füge die Person der HTML-Liste hinzu
        ergebnisListe.appendChild(li);
    });
}

  function displayPersonen() {
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



// ersatzmanagement.js

console.log('allePersonen:', allePersonen); // Überprüfe, ob die allePersonen-Liste korrekt geladen wird

// Initialisierung der Geschlechterquote aus dem localStorage oder Standardwert 2
let geschlechtsanteil_w = localStorage.getItem("geschlechtsanteil_w") ? parseInt(localStorage.getItem("geschlechtsanteil_w")) : 2;

// Sucht die männliche Ersatzperson mit dem höchsten Listenplatz
function finde_hoechste_maennliche_ersatzperson(eingeladen) {
    return allePersonen
        .filter(person => person.geschlecht === 'm' && !person.ordentlich && person.anwesend && !eingeladen.includes(person)) // Nur Ersatzpersonen und männlich
        .sort((a, b) => b.listenplatz - a.listenplatz)[0]; // Höchster Listenplatz zuerst
}

// Sucht die weibliche Ersatzperson mit dem niedrigsten Listenplatz
function finde_niedrigste_weibliche_ersatzperson(eingeladen) {
    return allePersonen
        .filter(person => person.geschlecht === 'w' && !person.ordentlich && person.anwesend && !eingeladen.includes(person)) // Nur Ersatzpersonen und weiblich
        .sort((a, b) => a.listenplatz - b.listenplatz)[0]; // Niedrigster Listenplatz zuerst
}

// Sucht die Ersatzperson mit dem niedrigsten Listenplatz (beliebiges Geschlecht)
function finde_beliebige_ersatzperson(eingeladen) {
    return allePersonen
        .filter(person => !person.ordentlich && person.anwesend && !eingeladen.includes(person)) // Nur Ersatzpersonen, die anwesend sind
        .sort((a, b) => a.listenplatz - b.listenplatz)[0]; // Niedrigster Listenplatz zuerst
}

// Berechnet die Anzahl der weiblichen Personen unter den eingeladenen Personen
function anzahl_weiblich(eingeladen) {
    return eingeladen.filter(person => person.geschlecht === 'w').length;
}

// Logik zur Einladung von Personen und Management der Frauenquote
  function eingeladene_personen() {
    let eingeladen = []; // Liste der final eingeladenen Personen
    let nachgeladen_fuer = {}; // Dictionary, um nachzuhalten, für wen eine Ersatzperson nachgeladen wurde

    // Zunächst werden alle anwesenden ordentlichen Mitglieder eingeladen
    const ordentlicheMitglieder = allePersonen.filter(person => person.ordentlich); // Filtere ordentliche Mitglieder
    let fehlende_mitglieder = ordentlicheMitglieder.filter(person => !person.anwesend).length;

    ordentlicheMitglieder.forEach(person => {
        if (person.anwesend) {
            eingeladen.push(person);
        }
    });

    // Für jede nicht anwesende Person wird eine Ersatzperson nachgeladen
    ordentlicheMitglieder.forEach(person => {
        if (!person.anwesend && fehlende_mitglieder > 0) {
            let ersatz;
            do {
                ersatz = finde_beliebige_ersatzperson(eingeladen);
            } while (ersatz && eingeladen.includes(ersatz));

            if (ersatz) {
                eingeladen.push(ersatz);
                nachgeladen_fuer[ersatz.name] = person.name;
                fehlende_mitglieder--;
            } else {
                console.log("Keine Ersatzpersonen mehr verfügbar.");
            }
        }
    });

    // Überprüfe die Mindestanzahl an Frauen
    while (anzahl_weiblich(eingeladen) < geschlechtsanteil_w) {
        let weibliche_ersatz = finde_niedrigste_weibliche_ersatzperson(eingeladen);
        if (!weibliche_ersatz) {
            console.log("Keine weiblichen Ersatzpersonen mehr verfügbar.");
            break;
        }

        let maennliche_ersatz = finde_hoechste_maennliche_ersatzperson(eingeladen);
        if (!maennliche_ersatz) {
            console.log("Keine männlichen Ersatzpersonen mehr zum Entfernen verfügbar.");
            break;
        }

        eingeladen = eingeladen.filter(person => person !== maennliche_ersatz);
        eingeladen.push(weibliche_ersatz);
        nachgeladen_fuer[weibliche_ersatz.name] = `ersetzt ${maennliche_ersatz.name}`;
    }

    return { eingeladen, nachgeladen_fuer };
}


// Funktion zum Berechnen und Eintragen des nächsten freien Listenplatzes
function setzeNaechstenFreienListenplatz(liste) {
    let naechsterListenplatz;

    // Filtere Personen nach der gewählten Liste und ermittle den höchsten Listenplatz
    let personenInListe = allePersonen.filter(p => p.liste === liste);
    if (personenInListe.length > 0) {
        let hoechsterListenplatz = Math.max(...personenInListe.map(p => p.listenplatz));
        naechsterListenplatz = hoechsterListenplatz + 1;
    } else {
        naechsterListenplatz = 1; // Start bei 1, falls die Liste leer ist
    }

    // Setze den Listenplatz im Formular
    document.getElementById("listenplatz").value = naechsterListenplatz;
}

// Funktion zum Aktualisieren des Dropdown-Menüs mit den vorhandenen Listen
function aktualisiereListenDropdown() {
    let dropdown = document.getElementById("liste");
    dropdown.innerHTML = '<option value="">Liste auswählen</option>'; // Standardoption

    listen.forEach(liste => {
        let option = document.createElement("option");
        option.value = liste;
        option.textContent = liste; // Anzeige der Liste im Dropdown
        dropdown.appendChild(option); // Füge die Option dem Dropdown hinzu
    });
}

function setzeStandardwerte() {
    // Prüfen, ob bereits Personen existieren
    if (allePersonen.length > 0) {
        // Letzte Person ermitteln
        let letztePerson = allePersonen[allePersonen.length - 1];

        // Werte der letzten Person in das Formular einfügen
        document.getElementById("geschlecht").value = letztePerson.geschlecht;
        document.getElementById("ordentlich").checked = letztePerson.ordentlich;
        document.getElementById("liste").value = letztePerson.liste;
    }
}


// Automatisch den freien Listenplatz beim Laden des Formulars setzen
document.getElementById("liste").addEventListener("change", function () {
    let liste = this.value;
    setzeNaechstenFreienListenplatz(liste); // Setze den nächsten freien Listenplatz, wenn die Liste gewechselt wird
});

// Setze den Listenplatz initial beim Laden der Seite
window.onload = function () {
  
    displayPersonen(); // Ruft die Funktion auf, um die Personen anzuzeigen
    aktualisiereListenDropdown(); // Aktualisiere das Dropdown-Menü beim Laden der Seite
    let liste = document.getElementById("liste").value;
    setzeNaechstenFreienListenplatz(liste); // Setze den Listenplatz basierend auf der ersten Liste

    // Setze die Standardwerte basierend auf der letzten Person
    setzeStandardwerte();
  
};


// Event Listener für den "Alle Listen löschen"-Button
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("deleteAllButton").addEventListener('click', () => {
        // Bestätigungsdialog anzeigen
        const confirmation = confirm("Möchten Sie wirklich alle Einträge löschen?");
        
        // Überprüfe, ob der Benutzer auf "Ja" geklickt hat
        if (confirmation) {
            loescheAlleListen(); // Rufe die Funktion auf, um die Listen zu löschen
            alert("Alle Einträge wurden gelöscht."); // Optional: Nachricht, dass die Einträge gelöscht wurden
        } else {
            console.log("Löschvorgang abgebrochen.");
        }
    });
});




// Funktion zum Hinzufügen der Event Listener für die Tabellen
  function addEventListeners() {
    // Event Delegation für das Klicken in der gemeinsamen Tabelle für alle Personen
    document.getElementById("personenTabelle").addEventListener('click', (event) => {
        const target = event.target; // Erfasse das angeklickte Element

        // Prüfe, ob der Bearbeiten-Button geklickt wurde
        if (target.classList.contains('editButton')) {
            // Hole die ID der Person aus den Datenattributen
            const personId = target.getAttribute('data-id');
            console.log(`Bearbeiten-Button geklickt: id=${personId}`);
            
            // Rufe die Bearbeiten-Funktion auf und übergebe die ID der Person
            bearbeitenPerson(personId);
        }

        // Prüfe, ob der Löschen-Button geklickt wurde
        if (target.classList.contains('deleteButton')) {
            // Hole die ID der Person aus den Datenattributen
            const personId = target.getAttribute('data-id');
            console.log(`Löschen-Button geklickt: id=${personId}`);
            
            // Rufe die Löschfunktion auf und übergebe die ID der Person
            loeschenPerson(personId);
        }
    });

    // Event Listener für den "Einladen"-Button
    document.getElementById("einladenButton").addEventListener('click', () => {
        console.log("Einladen-Button geklickt");

        // Hole die eingeladenen Personen mit der Funktion eingeladene_personen
        let { eingeladen, nachgeladen_fuer } = eingeladene_personen();

        // Zeige die eingeladenen Personen an
        displayEingeladenePersonen(eingeladen);

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


