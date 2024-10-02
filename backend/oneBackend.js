// Die Person-Klasse definieren und  ieren
  class Person {
    constructor(ordentlich, liste, rang, geschlecht, name, mail, anwesend) {
        this.id = Number(rang); // Stelle sicher, dass die ID (rang) eine Ganzzahl ist
        this.ordentlich = ordentlich;
        this.liste = liste;
        this.rang = Number(rang); // Konvertiere rang in eine Ganzzahl
        this.geschlecht = geschlecht;
        this.name = name;
        this.mail = mail;
        this.anwesend = anwesend;
    }

  

    // Benutzerdefinierte toString()-Methode für die Textrepräsentation
    toString() {
        return `${this.name} (Rang: ${this.rang}, ${this.ordentlich ? 'Ordentlich' : 'Ersatz'}, Liste: ${this.liste}, Geschlecht: ${this.geschlecht}, Anwesend: ${this.anwesend ? 'Ja' : 'Nein'})`;
    }
}

  let allePersonen = [];
// Personen beim Start laden
allePersonen = ladePersonen();


// Funktion zum Speichern der Personenliste im localStorage
function speicherePersonen(allePersonen) {
    localStorage.setItem("allePersonen", JSON.stringify(allePersonen));
    console.log('Personen gespeichert:', allePersonen);
}

// Funktion zum Laden der Personen aus dem localStorage
function ladePersonen() {
    let personenRaw = localStorage.getItem("allePersonen");
    if (personenRaw) {
        console.log('Personen geladen:', JSON.parse(personenRaw));
        return JSON.parse(personenRaw);
    }
    return [];
}




  function bearbeitenPerson(id) {
    console.log('Funktionsaufruf: bearbeitenPerson mit ID:', id);

    // Überprüfen, ob die ID gültig ist
    if (typeof id === 'undefined' || id === null) {
        console.error('Ungültige ID übergeben:', id);
        return;
    }

    // Logge die gesamte Liste der Personen für eine genauere Überprüfung
    console.log('Aktuelle Personenliste:', allePersonen);

    // Konvertiere die ID in eine Zahl, falls sie als String übergeben wurde
    let numericId = Number(id);
    console.log('Vergleiche mit konvertierter ID (numericId):', numericId);

    // Suche die Person anhand der übermittelten ID im gemeinsamen Array 'allePersonen'
    let person = allePersonen.find(p => p.id === numericId);

    // Überprüfen, ob die Person gefunden wurde
    if (!person) {
        console.error('Person nicht gefunden mit ID:', numericId);
        console.log('Aktuelle Liste der IDs in allePersonen:', allePersonen.map(p => p.id));
        return;  // Falls die Person nicht existiert, Funktion beenden
    }

    // Wenn die Person gefunden wurde, gebe ihre Daten aus
    console.log('Person gefunden:', person);
    // Hier kannst du mit den gefundenen Personendaten weiterarbeiten
}


    // Person existiert, nun die Formularfelder mit den Werten füllen
    document.getElementById("name").value = person.name;
    document.getElementById("email").value = person.mail;
    document.getElementById("geschlecht").value = person.geschlecht;
    document.getElementById("ordentlich").checked = person.ordentlich; // Neues Feld für ordentlich
    document.getElementById("liste").value = person.liste;
    document.getElementById("anwesend").checked = person.anwesend;
    document.getElementById("rang").value = person.rang;
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
    let rang = parseInt(document.getElementById("rang").value);
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

    // Überprüfen, ob der Rang bereits existiert
    let vorhandenePerson = allePersonen.find(p => p.rang === rang);

    if (vorhandenePerson) {
        // Bestätigungsdialog, ob die ursprüngliche Person ersetzt werden soll
        let bestaetigung = confirm(`Eine Person mit diesem Rang (${rang}) existiert bereits. Möchten Sie den ursprünglichen durch den neuen Eintrag ersetzen?`);

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

   // Falls keine Person mit diesem Rang existiert, neue Person erstellen
   let neuePerson = new Person(ordentlich, liste, rang, geschlecht, name, email, anwesend);

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

    // Setze den nächsten freien Rang
    setzeNaechstenFreienRang(liste);
  
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
function displayEingeladenePersonen(personenListe) {
    let ergebnisListe = document.getElementById("eingeladenePersonen");
    ergebnisListe.innerHTML = ""; // Leeren der Ergebnisliste

    // Durch die Personenliste iterieren und sie in der HTML-Liste anzeigen
    personenListe.forEach(person => {
        let li = document.createElement("li");

        // Hole den Nachladegrund, falls vorhanden
        let nachgeladenText = person.nachladegrund ? ` (${person.nachladegrund})` : '';

        // Erstelle die Textrepräsentation der Person
        li.textContent = `${person.name || "Unbekannte Person"} (Rang: ${person.rang}, Liste: ${person.liste}, Geschlecht: ${person.geschlecht.toUpperCase()})${nachgeladenText}`;

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
            <th>Rang</th>
            <th>Name</th>
            <th>Geschlecht</th>
            <th>Anwesend</th>
            <th>Ordentlich</th>
            <th>Liste</th>
            <th>Aktionen</th>
        </tr>
    `;

    // Sortiere die Personen nach 'ordentlich', dann 'liste', dann 'rang'
    allePersonen.sort((a, b) => {
        // Sortiere zuerst nach 'ordentlich' (ordentliche Mitglieder kommen zuerst)
        if (a.ordentlich !== b.ordentlich) {
            return b.ordentlich - a.ordentlich;
        }
        // Sortiere nach 'liste' (z.B. Liste 1, Liste 2 usw.)
        if (a.liste !== b.liste) {
            return a.liste - b.liste;
        }
        // Sortiere nach 'rang' innerhalb der Liste
        return a.rang - b.rang;
    });

    // Zeige alle Personen in der Tabelle an
    allePersonen.forEach((person) => {
        let row = personenTabelle.insertRow();
    
        // Fülle die Zellen der Zeile mit den Personendaten
        row.innerHTML = `
          <td>${person.rang}</td> <!-- Rang an die erste Stelle setzen -->
          <td>${person.name}</td> <!-- Name an die zweite Stelle setzen -->
          <td>${person.geschlecht}</td>
          <td>
              <input type="checkbox" class="anwesend-checkbox" data-rang="${person.rang}" ${person.anwesend ? 'checked' : ''} />
          </td> <!-- Checkbox für Anwesend -->
          <td><input type="checkbox" ${person.ordentlich ? 'checked' : ''} disabled /></td> <!-- Checkbox für Ordentlich -->
          <td>${person.liste}</td>
          <td>
            <button class="editButton" data-id="${person.id}">Bearbeiten</button> <!-- Verwende die ID -->
            <button class="deleteButton" data-id="${person.id}">Löschen</button> <!-- Verwende die ID -->
          </td>
      `;
    });

    // Füge Event-Listener für die "Anwesend"-Checkboxen hinzu
    document.querySelectorAll('.anwesend-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', function () {
            let rang = parseInt(this.getAttribute('data-rang'));
            let isChecked = this.checked;

            // Finde die Person in der allePersonen-Liste anhand des Ranges und aktualisiere den 'anwesend'-Status
            let person = allePersonen.find(p => p.rang === rang);
            if (person) {
                person.anwesend = isChecked;

                // Speichere die gesamte aktualisierte Personenliste im localStorage
                speicherePersonen(allePersonen);
            }
        });
    });


    // Füge die Event Listener für die Schaltflächen hinzu, nachdem die Zeilen dynamisch erstellt wurden
    addEventListeners();
}


// ersatzmanagement.js

function erzeuge_platzhalterperson(rang, liste) {
    return {
        name: "Kein Ersatz verfügbar",
        rang: rang,
        liste: liste,
        geschlecht: "N/A",
        nachladegrund: `Kein Ersatz mehr verfügbar für Rang ${rang}`
    };
}


function lade_ersatzperson_mit_mg(eingeladen, mg_geschlecht, liste, mg_verfuegbar) {
    console.log(`Aufruf von lade_ersatzperson_mit_mg: mg_geschlecht=${mg_geschlecht}, liste=${liste}, mg_verfuegbar=${mg_verfuegbar}`);
    let ersatz;

    // Wenn eine MG-Person geladen werden soll
    if (mg_verfuegbar) {
        ersatz = allePersonen
            .filter(person => person.geschlecht === mg_geschlecht && !person.ordentlich && person.anwesend && !eingeladen.includes(person) && person.liste === liste)
            .sort((a, b) => a.rang - b.rang)[0];

        // Falls keine MG-Person in derselben Liste gefunden wurde, eine beliebige MG-Person suchen
        if (!ersatz) {
            ersatz = allePersonen
                .filter(person => person.geschlecht === mg_geschlecht && !person.ordentlich && person.anwesend && !eingeladen.includes(person))
                .sort((a, b) => a.rang - b.rang)[0];
        }
    }

    
    return ersatz;
}

function lade_ersatzperson_ohne_minderheit(eingeladen, liste) {
    console.log(`Aufruf von lade_ersatzperson_ohne_minderheit für Liste: ${liste}`);
    let ersatz;

    // Zuerst nach einer Ersatzperson in der gleichen Liste suchen
    ersatz = allePersonen
        .filter(person => !person.ordentlich && person.anwesend && !eingeladen.includes(person) && person.liste === liste)
        .sort((a, b) => a.rang - b.rang)[0];

    // Wenn keine Person der gleichen Liste gefunden wird, versuche, eine beliebige Ersatzperson zu finden
    if (!ersatz) {
        ersatz = allePersonen
            .filter(person => !person.ordentlich && person.anwesend && !eingeladen.includes(person))
            .sort((a, b) => a.rang - b.rang)[0];
    }

    if (ersatz) {
        console.log(`Ersatzperson gefunden: ${ersatz.name}, Rang: ${ersatz.rang}, Liste: ${ersatz.liste}`);
    } else {
        console.log("Keine normale Ersatzperson gefunden.");
    }

    return ersatz;
}


function eingeladene_personen() {
    let eingeladen = []; // Liste der final eingeladenen Personen
    let nachgeladen_fuer = {}; // Dictionary, um nachzuhalten, für wen eine Ersatzperson nachgeladen wurde

    // Zunächst werden alle anwesenden ordentlichen Mitglieder eingeladen
    const ordentlicheMitglieder = allePersonen.filter(person => person.ordentlich);
    let fehlende_mitglieder = ordentlicheMitglieder.filter(person => !person.anwesend).length;

    // Hole die Einstellungen für das Minderheitengeschlecht und die Anzahl
    let mg_anzahl = parseInt(localStorage.getItem("geschlechtsanteil")) || 2;
    let mg_geschlecht = localStorage.getItem("geschlecht_mg") || "w";
    let eingeladenes_mg = eingeladen.filter(person => person.geschlecht === mg_geschlecht).length;

    // Zunächst werden alle anwesenden ordentlichen Mitglieder eingeladen
    ordentlicheMitglieder.forEach(person => {
        if (person.anwesend) {
            eingeladen.push(person);
        }
    });

    console.log(`Start der Nachlaladung. Fehlende Mitglieder: ${fehlende_mitglieder}, MG-Anzahl: ${mg_anzahl}`);

    // Für jede fehlende Person wird eine Ersatzperson nachgeladen
    ordentlicheMitglieder.forEach(person => {
        if (!person.anwesend && fehlende_mitglieder > 0) {
            let ersatz;
            let grund;

            // Solange die Anzahl der fehlenden Mitglieder größer ist als die MG-Anzahl, lade nur Ersatzpersonen ohne MG
            if (fehlende_mitglieder > mg_anzahl) {
                ersatz = lade_ersatzperson_ohne_minderheit(eingeladen, person.liste);
                grund = `Nachgeladen für Rang ${person.rang}, Liste ${person.liste}`;
            }

            // Wenn die Anzahl der fehlenden Mitglieder kleiner oder gleich der MG-Anzahl ist, prüfe die MG-Quote
            if (fehlende_mitglieder <= mg_anzahl) {
                const mg_verfuegbar = eingeladenes_mg < mg_anzahl;

                // Versuche, eine MG-Person zu laden
                if (mg_verfuegbar) {
                    ersatz = lade_ersatzperson_mit_mg(eingeladen, mg_geschlecht, person.liste, mg_verfuegbar);
                    if (ersatz) {
                        eingeladenes_mg++;
                        grund = `Nachgeladen wegen Minderheitengeschlecht (${mg_geschlecht}) für Rang ${person.rang}, Liste ${person.liste}`;
                    }
                }

                // Fallback: Falls keine MG-Person verfügbar ist, lade normale Ersatzperson
                if (!ersatz) {
                    ersatz = lade_ersatzperson_ohne_minderheit(eingeladen, person.liste);
                    grund = `Nachgeladen für Rang ${person.rang}, Liste ${person.liste}, Minderheitengeschlecht war nicht verfügbar.`;
                }
            }

            // Füge die Ersatzperson hinzu, falls eine gefunden wurde
            if (ersatz) {
                ersatz.nachladegrund = grund;
                eingeladen.push(ersatz);
                fehlende_mitglieder--;
                console.log(`Ersatzperson ${ersatz.name} eingeladen: ${grund}`);
            } else {
                // Wenn keine Ersatzperson gefunden wurde, füge eine Platzhalterperson hinzu
                let platzhalter = erzeuge_platzhalterperson(person.rang, person.liste);
                eingeladen.push(platzhalter);
                fehlende_mitglieder--;
                console.log(`Platzhalterperson für ${person.rang} eingeladen: ${platzhalter.nachladegrund}`);
            }
        }
    });

    return { eingeladen };
}






// Funktion zum Berechnen und Eintragen des nächsten freien Ranges
function setzeNaechstenFreienRang(liste) {
    let naechsterRang;

    // Filtere Personen nach der gewählten Liste und ermittle den höchsten Rang
    let personenInListe = allePersonen.filter(p => p.liste === liste);
    if (personenInListe.length > 0) {
        let hoechsterRang = Math.max(...personenInListe.map(p => p.rang));
        naechsterRang = hoechsterRang + 1;
    } else {
        naechsterRang = 1; // Start bei 1, falls die Liste leer ist
    }

    // Setze den Rang im Formular
    document.getElementById("rang").value = naechsterRang;
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


// Automatisch den freien Rang beim Laden des Formulars setzen
document.getElementById("liste").addEventListener("change", function () {
    let liste = this.value;
    setzeNaechstenFreienRang(liste); // Setze den nächsten freien Rang, wenn die Liste gewechselt wird
});

// Setze den Rang initial beim Laden der Seite
window.onload = function () {
  
    displayPersonen(); // Ruft die Funktion auf, um die Personen anzuzeigen
    aktualisiereListenDropdown(); // Aktualisiere das Dropdown-Menü beim Laden der Seite
    let liste = document.getElementById("liste").value;
    setzeNaechstenFreienRang(liste); // Setze den Rang basierend auf der ersten Liste

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
          
            console.log('Edit Button ID:', target.getAttribute('data-id'));
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

        // Zeige die eingeladenen Personen an und übergebe auch die Nachladegründe
    displayEingeladenePersonen(eingeladen, nachgeladen_fuer);

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


