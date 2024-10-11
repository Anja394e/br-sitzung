// Die Person-Klasse definieren
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
    // Logging, um zu sehen, welche ID übergeben wird
    console.log('Funktionsaufruf: bearbeitenPerson mit ID:', id);

    // Überprüfen, ob die ID gültig ist
    if (typeof id === 'undefined' || id === null) {
        console.error('Ungültige ID übergeben:', id);
        return;  // Beende die Funktion, wenn die ID ungültig ist
    }

    // Konvertiere die ID in eine Zahl (falls sie als String übergeben wurde)
    let numericId = Number(id);
    console.log('Konvertierte ID:', numericId);

    // Suche die Person anhand der übermittelten (konvertierten) ID im gemeinsamen Array 'allePersonen'
    let person = allePersonen.find(p => p.id === numericId);

    // Überprüfen, ob die Person gefunden wurde
    if (!person) {
        console.error('Person nicht gefunden mit ID:', numericId);
        console.log('Verfügbare IDs in der Liste:', allePersonen.map(p => p.id)); // Logge alle verfügbaren IDs zur Kontrolle
        return;  // Falls die Person nicht existiert, Funktion beenden
    }

    // Logge die gefundene Person
    console.log('Person gefunden:', person);

    // Person existiert, nun die Formularfelder mit den Werten füllen
    document.getElementById("name").value = person.name;
    document.getElementById("email").value = person.mail;
    document.getElementById("geschlecht").value = person.geschlecht;
    document.getElementById("ordentlich").checked = person.ordentlich; // Neues Feld für ordentlich
    document.getElementById("liste").value = person.liste;
    document.getElementById("anwesend").checked = person.anwesend;
    document.getElementById("rang").value = person.rang;

    console.log('Formular wurde mit den Daten der Person ausgefüllt.');
}




// Funktion zum Löschen einer Person
function loeschenPerson(id) {
    // Logging, um die übergebene ID zu sehen
    console.log('Funktionsaufruf: loeschenPerson mit ID:', id);

    // Überprüfen, ob die ID gültig ist
    if (typeof id === 'undefined' || id === null) {
        console.error('Ungültige ID übergeben:', id);
        return;  // Beende die Funktion, wenn die ID ungültig ist
    }

    // Konvertiere die ID in eine Zahl (falls sie als String übergeben wurde)
    let numericId = Number(id);
    console.log('Konvertierte ID:', numericId);

    // Finde den Index der Person anhand der übermittelten (konvertierten) ID
    const index = allePersonen.findIndex(p => p.id === numericId);

    // Überprüfen, ob die Person gefunden wurde
    if (index === -1) {
        console.error('Person nicht gefunden mit ID:', numericId);
        console.log('Verfügbare IDs in der Liste:', allePersonen.map(p => p.id)); // Logge alle verfügbaren IDs
        return;  // Falls die Person nicht existiert, Funktion beenden
    }

    // Logge die Person, die gelöscht wird
    console.log('Lösche Person:', allePersonen[index]);

    // Person aus dem gemeinsamen Array entfernen
    allePersonen.splice(index, 1);

    // Personen in localStorage speichern
    speicherePersonen(allePersonen);

    // Aktualisiere die Tabelle
    displayPersonen();

    console.log('Person mit ID', numericId, 'wurde erfolgreich gelöscht.');
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

// Funktion zum Anzeigen der eingeladenen Personen im Standard-Tabellenformat
function displayEingeladenePersonen(personenListe) {
    // Referenziere die Tabelle für die eingeladenen Personen
    let ergebnisTabelle = document.getElementById("eingeladenePersonenTabelle");

    // Leere die Tabelleninhalte und setze die Header für die Tabelle
    ergebnisTabelle.innerHTML = `
        <thead>
            <tr>
                <th>Rang</th>
                <th>Name</th>
                <th>E-Mail</th>
                <th>Geschlecht</th>
                <th>Ordentlich</th>
                <th>Liste</th>
                <th>Nachladegrund</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    `;

    // Sortiere die eingeladenen Personen nach 'rang'
    personenListe.sort((a, b) => a.rang - b.rang);

    // Zeige die eingeladenen Personen in der Tabelle an
    personenListe.forEach(person => {
        let row = ergebnisTabelle.querySelector('tbody').insertRow();

        // Überprüfe, ob die Person ordentlich ist, um den Rang fett darzustellen
        let rangCell = `<td>${person.rang}</td>`;
        if (person.ordentlich) {
            rangCell = `<td><strong>${person.rang}</strong></td>`;  // Fettgedruckter Rang für ordentliche Mitglieder
        }

        // Setze den Nachladegrund, falls vorhanden, oder automatisch "ordentlich" für ordentliche Mitglieder
        let nachladegrundText = person.ordentlich ? 'ordentlich' : (person.nachladegrund || 'Kein Grund angegeben');

        // Fülle die Zellen der Zeile mit den Personendaten
        row.innerHTML = `
          ${rangCell}  <!-- Rang (fett darstellen, wenn ordentlich) -->
          <td>${person.name}</td>
          <td>${person.mail}</td>
          <td>${person.geschlecht.toUpperCase()}</td>
          <td><input type="checkbox" ${person.ordentlich ? 'checked' : ''} disabled /></td> <!-- Checkbox für Ordentlich -->
          <td>${person.liste}</td>
          <td>${nachladegrundText}</td> <!-- Nachladegrund anzeigen -->
        `;
    });

    // Zeige den Ergebniscontainer an, wenn es eingeladene Personen gibt
    if (personenListe.length > 0) {
        document.getElementById("ergebnisContainer").style.display = 'block';
        displayEinladungsButton(personenListe); // E-Mail-Button wird generiert
    } else {
        document.getElementById("ergebnisContainer").style.display = 'none';
        alert("Keine Personen zum Einladen verfügbar.");
    }
}

// Globale Funktionen für die Event-Handler

// Funktion für den E-Mail-Versand (der Klick-Event-Handler)
function handleEmailClick(eingeladen) {
    // Hole die verarbeiteten E-Mail-Daten aus der sendeEmailAnEingeladene-Funktion
    const { emailAdressen, subject, body } = sendeEmailAnEingeladene(eingeladen);

    // Erstelle den mailto-Link mit den verarbeiteten Daten
    let mailtoLink = `mailto:${emailAdressen.join('; ')}` + `?subject=${subject}&body=${body}`;

    // Öffne das E-Mail-Programm mit dem mailto-Link
    window.location.href = mailtoLink;
}

let exportButtonActive = false; // Flag zur Verfolgung des Status des Export-Buttons

// Funktion zum Überprüfen des Status des Export-Buttons
function checkExportButtonStatus() {
    if (exportButtonActive) {
        console.log("Der Event-Listener für den Export-Button ist aktiv.");
    } else {
        console.log("Der Event-Listener für den Export-Button ist nicht aktiv.");
    }
}

// Funktion zum Exportieren der eingeladenen Personen als CSV
function handleExportClick(eingeladen) {
    console.log("Exportiere die eingeladenen Personen...");
    // Hier kannst du den Export-Logik-Code hinzufügen
    exportToCSV(eingeladen);  // Übergibt die aktuelle Liste an die Export-Funktion
}
    
// Funktion für den Outlook-Kalendereintrag
function handleOutlookClick(eingeladen) {
    // Hole die Werte aus den Eingabefeldern (Organisator, Datum, Startzeit, Endzeit)
    let organizerEmail = document.getElementById("organizerEmailInput").value;
    let meetingDate = document.getElementById("meetingDate").value;
    let startTime = document.getElementById("startTime").value;
    let endTime = document.getElementById("endTime").value;

    // Überprüfe, ob alle erforderlichen Felder ausgefüllt wurden
    if (!organizerEmail.trim() || !meetingDate || !startTime || !endTime) {
        alert("Bitte füllen Sie alle Felder aus.");  // Zeige Warnung, falls Felder fehlen
    } else {
        // Übergibt die E-Mail-Adresse, Datum und Zeiten an die Funktion für den Kalendereintrag
        erstelleOutlookKalendereintrag(eingeladen, organizerEmail, meetingDate, startTime, endTime);
    }
}


// Generiere und zeige den E-Mail-Versand-Button und die Eingabefelder an
function displayEinladungsButton(eingeladen) {
    // Prüfe, ob der E-Mail-Versand-Button bereits existiert, um keine doppelten Buttons zu generieren
    let emailButton = document.getElementById("emailButton");
    if (!emailButton) {
        // Erstelle den E-Mail-Versand-Button
        emailButton = document.createElement("button");
        emailButton.id = "emailButton";
        emailButton.innerText = "E-Mail an Eingeladene senden";
        emailButton.className = "button"; // Button-Klasse für Konsistenz

        // Füge den Button zum Container hinzu
        document.getElementById("ergebnisContainer").appendChild(emailButton);
    }
    
    // Entferne den vorherigen Event-Listener (falls vorhanden)
    else {
        if (emailButton._handler) {
            emailButton.removeEventListener('click', emailButton._handler);
        }
    }
    
    // Füge den neuen Event-Listener hinzu
    const handlerEmailClick = () => handleEmailClick(eingeladen);
    emailButton._handler = handlerEmailClick;
    emailButton.addEventListener('click', handlerEmailClick );
    
    
    // Prüfe, ob der Export-Button bereits existiert
    let exportButton = document.getElementById("exportButton");
    if (!exportButton) {
        // Erstelle den Export-Button, wenn er nicht existiert
        exportButton = document.createElement("button");
        exportButton.id = "exportButton";
        exportButton.innerText = "Export in CSV";
        exportButton.className = "custom-button"; // Spezifische Klasse für den Button

        // Füge den Button zum Container hinzu
        document.getElementById("ergebnisContainer").appendChild(exportButton);
        console.log("Export-Button erstellt.");
    } else {
        // Entferne den vorherigen Event-Listener (falls vorhanden)
        if (exportButton._handler) {
            exportButton.removeEventListener('click', exportButton._handler);
        }
    }

    // Füge den neuen Event-Listener hinzu
    const handlerExportClick = () => handleExportClick(eingeladen);
    exportButton._handler = handlerExportClick;
    exportButton.addEventListener('click', handlerExportClick);
    

    // Erstelle das Eingabefeld für die Organisator-E-Mail, wenn es noch nicht existiert
    let emailInput = document.getElementById("organizerEmailInput");
    if (!emailInput) {
        // Erstelle das Label und das Eingabefeld für die E-Mail-Adresse des Organisators
        let emailLabel = document.createElement("label");
        emailLabel.innerText = "E-Mail-Adresse des Organisators:";
        emailLabel.className = "label"; // Label-Styling

        emailInput = document.createElement("input");
        emailInput.type = "email";
        emailInput.id = "organizerEmailInput";
        emailInput.placeholder = "organizer@example.com";
        emailInput.className = "input"; // Klasse für Eingabefelder

        // Erstelle das Eingabefeld für das Datum der Sitzung
        let dateLabel = document.createElement("label");
        dateLabel.innerText = "Datum der Sitzung:";
        dateLabel.className = "label";

        let dateInput = document.createElement("input");
        dateInput.type = "date";
        dateInput.id = "meetingDate";
        dateInput.className = "input";

        // Setze das Standarddatum auf einen Monat in der Zukunft
        let today = new Date();
        today.setMonth(today.getMonth() + 1); // Einen Monat in der Zukunft
        let defaultDate = today.toISOString().split('T')[0]; // Format für das Eingabefeld (YYYY-MM-DD)
        dateInput.value = defaultDate;

        // Erstelle das Eingabefeld für die Startzeit
        let startTimeLabel = document.createElement("label");
        startTimeLabel.innerText = "Startzeit:";
        startTimeLabel.className = "label";

        let startTimeInput = document.createElement("input");
        startTimeInput.type = "time";
        startTimeInput.id = "startTime";
        startTimeInput.className = "input";

        // Setze die Standard-Startzeit auf 09:00 Uhr
        startTimeInput.value = "09:00";

        // Erstelle das Eingabefeld für die Endzeit
        let endTimeLabel = document.createElement("label");
        endTimeLabel.innerText = "Endzeit:";
       endTimeLabel.className = "label";

        let endTimeInput = document.createElement("input");
        endTimeInput.type = "time";
        endTimeInput.id = "endTime";
        endTimeInput.className = "input";

        // Setze die Standard-Endzeit auf 16:00 Uhr
        endTimeInput.value = "16:00";

        // Erstelle einen Container für die Organisator-E-Mail und die neuen Felder (Datum, Startzeit, Endzeit)
        let div = document.createElement("div");
        div.className = "form-group"; // Klasse hinzufügen für ein flexibles Layout

        // Füge alle Felder zum Container (div) hinzu
        div.appendChild(emailLabel);
        div.appendChild(emailInput);
        div.appendChild(dateLabel);
        div.appendChild(dateInput);
        div.appendChild(startTimeLabel);
        div.appendChild(startTimeInput);
        div.appendChild(endTimeLabel);
        div.appendChild(endTimeInput);

        // Füge den Container mit allen Feldern in den Ergebnis-Container ein
        document.getElementById("ergebnisContainer").appendChild(div);
    }

    // Prüfe, ob der Outlook-Kalendereintrag-Button bereits existiert
    let outlookButton = document.getElementById("outlookButton");
    if (!outlookButton) {
        // Erstelle den Outlook-Kalendereintrag-Button
        outlookButton = document.createElement("button");
        outlookButton.id = "outlookButton";
        outlookButton.innerText = "Kalendereintrag für Outlook erstellen";
        outlookButton.className = "button"; // Gleiche Button-Klasse

        // Füge den Button zum Container hinzu 
        document.getElementById("ergebnisContainer").appendChild(outlookButton);
    }
    
    // Entferne den vorherigen Event-Listener (falls vorhanden)
    else {
        if (outlookButton._handler) {
            outlookButton.removeEventListener('click', outlookButton._handler);
        }

    }
    
    // Erstelle und füge den neuen Event-Listener hinzu
    const handlerOutlookClick = () => handleOutlookClick(eingeladen);
    outlookButton._handler = handlerOutlookClick;
    outlookButton.addEventListener('click', handlerOutlookClick);

}

// Funktion, um einen Outlook-Kalendereintrag (im iCal-Format) zu erstellen
function erstelleOutlookKalendereintrag(eingeladen, organizerEmail, meetingDate, startTime, endTime) {
    // Erstelle ein Datum-Objekt für Start und Ende basierend auf dem eingegebenen Datum und Zeiten
    let startDatum = new Date(`${meetingDate}T${startTime}`);
    let endDatum = new Date(`${meetingDate}T${endTime}`);

    // Formatiere die Daten im richtigen iCal-Format (YYYYMMDDTHHMMSSZ)
    const formatDateToICS = (date) => {
        return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    // Formatiere das Datum als dd.mm.yyyy für Anzeigezwecke (z.B. im Betreff oder Dateinamen)
    const formatDateForDisplay = (date) => {
        let day = ('0' + date.getDate()).slice(-2);   // Tag mit führender Null
        let month = ('0' + (date.getMonth() + 1)).slice(-2); // Monat mit führender Null
        let year = date.getFullYear();  // Jahr
        return `${day}.${month}.${year}`;  // Format dd.mm.yyyy
    };

    // Generiere eine eindeutige UID (Unique Identifier) für den Kalendereintrag
    const generateUID = (date) => {
        let randomString = Math.random().toString(36).substr(2, 9); // Zufällige Zeichenfolge
        let year = date.getFullYear();
        let month = ('0' + (date.getMonth() + 1)).slice(-2); // Monat mit führender Null
        let day = ('0' + date.getDate()).slice(-2); // Tag mit führender Null
        return `event-${year}${month}${day}-${randomString}@164.30.71.160`; // UID mit Datum und Zufallsstring
    };

    // Formatiere das Start- und Enddatum im iCal-Format
    let startDateICS = formatDateToICS(startDatum); // Startdatum im iCal-Format
    let endDateICS = formatDateToICS(endDatum);     // Enddatum im iCal-Format
    let formattedDate = formatDateForDisplay(startDatum); // Format für Dateiname und Betreff
    let uid = generateUID(startDatum); // UID generieren

    // Betreff und Beschreibung mit Datum für die Sitzung
    let subject = `Einladung zur Sitzung am ${formattedDate}`;
    let description = `DESCRIPTION:Dies ist die Beschreibung der Sitzung, die am ${formattedDate} stattfindet.`;

    // Erstelle die Liste der eingeladenen Teilnehmer (mit E-Mail-Adressen)
    let attendees = eingeladen
        .filter(person => person.mail && person.mail.trim() !== "") // Nur Personen mit gültigen E-Mail-Adressen
        .map(person => `ATTENDEE;RSVP=TRUE;PARTSTAT=NEEDS-ACTION;ROLE=REQ-PARTICIPANT:mailto:${person.mail}`) // Teilnehmerformat im iCal-Standard
        .join('\n');

    // Zeitzoneninformationen für Europe/Berlin hinzufügen (iCal-Format)
    let timezoneInfo = `
BEGIN:VTIMEZONE
TZID:Europe/Berlin
X-LIC-LOCATION:Europe/Berlin
BEGIN:STANDARD
DTSTART:19701025T030000
TZOFFSETFROM:+0200
TZOFFSETTO:+0100
TZNAME:CET
END:STANDARD
BEGIN:DAYLIGHT
DTSTART:19700329T020000
TZOFFSETFROM:+0100
TZOFFSETTO:+0200
TZNAME:CEST
END:DAYLIGHT
END:VTIMEZONE`;

    // Erstelle den vollständigen Kalendereintrag im iCal-Format
    let kalenderEintrag = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Einladungssystem//Kalendereintrag//DE
METHOD:PUBLISH
UID:${uid}
SEQUENCE:0
${timezoneInfo}
BEGIN:VEVENT
DTSTART;TZID=Europe/Berlin:${startDateICS}
DTEND;TZID=Europe/Berlin:${endDateICS}
SUMMARY:${subject}
ORGANIZER:mailto:${organizerEmail} 
STATUS:CONFIRMED
${attendees}
${description}
END:VEVENT
END:VCALENDAR`;

    // Erstelle die .ics-Datei und biete sie zum Download an, mit dem Datum im Dateinamen
    let blob = new Blob([kalenderEintrag.trim()], { type: "text/calendar" }); // trim() entfernt unnötige Leerzeichen
    let link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `outlook-einladung-${formattedDate.replace(/\./g, '-')}.ics`;  // Dateiname mit Datum (Punkte in Bindestriche umwandeln)
    link.click();
}



// Funktion zum Sammeln und Verarbeiten der E-Mail-Adressen und Inhalte
function sendeEmailAnEingeladene(eingeladen) {
    // Initialisiere die Listen für E-Mail-Adressen und fehlende E-Mails
    let emailAdressen = []; // E-Mail-Adressen müssen als Array initialisiert werden
    let fehlendeEmails = [];

    // Überprüfe jede Person und füge die E-Mail hinzu oder den Namen, falls keine E-Mail vorhanden ist
    eingeladen.forEach(person => {
        if (person.mail && person.mail.trim() !== "") {
            emailAdressen.push(person.mail); // E-Mail-Adressen sammeln
        } else if (person.name && person.name.trim() !== "") {
            // Falls keine E-Mail vorhanden ist, kopiere den Namen als Ersatz in die E-Mail-Liste
            emailAdressen.push(person.name);
        } else {
            // Falls weder E-Mail noch Name vorhanden ist, markiere die Person als "Unbekannt"
            fehlendeEmails.push(`Unbekannte Person (Listenplatz: ${person.rang})`);
        }
    });

    // Falls es Personen ohne E-Mail und ohne Namen gibt, zeige eine Warnung
    if (fehlendeEmails.length > 0) {
        alert("Die folgenden Personen haben weder Name noch E-Mail-Adresse: " + fehlendeEmails.join(', '));
        return;  // Aktion abbrechen
    }

    // Betreff und Nachrichtentext für die E-Mail
    let subject = encodeURIComponent("Einladung zur Sitzung");
    let body = encodeURIComponent("Hallo,\n\nhiermit lade ich euch zur Sitzung ein.");

    // Rückgabe der gesammelten E-Mail-Adressen, Betreff und Nachricht
    return { emailAdressen, subject, body };

}

// Funktion zum Exportieren der eingeladenen Personen als CSV
function exportToCSV(eingeladen) {
    // Erstelle eine CSV-Zeichenkette
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Rang,Name,E-Mail,Geschlecht,Ordentlich,Liste,Nachladegrund\n"; // Kopfzeilen

    // Füge jede Person als CSV-Zeile hinzu
    eingeladen.forEach(person => {
        let row = [
            person.rang,
            person.name,
            person.mail,
            person.geschlecht.toUpperCase(),
            person.ordentlich ? "Ja" : "Nein",
            person.liste,
            person.nachladegrund || "Kein Grund angegeben"
        ].join(","); // Verbinde die Werte mit Komma
        csvContent += row + "\n"; // Füge die Zeile der CSV-Zeichenkette hinzu
    });

    // Erstelle ein unsichtbares Element zum Herunterladen der Datei
    let encodedUri = encodeURI(csvContent);
    let link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "eingeladene_personen.csv");

    // Simuliere einen Klick auf das Download-Element
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}



  function displayPersonen() {
    // Referenziere die kombinierte Tabelle für alle Personen
    let personenTabelle = document.getElementById("personenTabelle");

    // Leere die Tabelleninhalte und setze die Header für die Tabelle
    personenTabelle.innerHTML = `
        <tr>
            <th>Rang</th>
            <th>Name</th>
            <th>E-Mail</th>
            <th>Geschlecht</th>
            <th>Anwesend</th>
            <th>Ordentlich</th>
            <th>Liste</th>
            <th>Aktionen</th>
        </tr>
    `;

    // Sortiere die Personen nach 'rang'
    allePersonen.sort((a, b) => {
        // Sortiere nach 'rang' innerhalb der Liste (in aufsteigender Reihenfolge Personen mit einem kleineren Rang (z.B. Rang 1) werden zuerst angezeigt)
            return a.rang - b.rang;
    });

    // Zeige alle Personen in der Tabelle an
    allePersonen.forEach((person) => {
        let row = personenTabelle.insertRow();

       // Überprüfe, ob die Person ordentlich ist, um den Rang fett darzustellen
        let rangCell = `<td>${person.rang}</td>`;
        if (person.ordentlich) {
            rangCell = `<td><strong>${person.rang}</strong></td>`;  // Fettgedruckter Rang für ordentliche Mitglieder
        }
    
        // Fülle die Zellen der Zeile mit den Personendaten
        row.innerHTML = `
          ${rangCell}  <!-- Rang (fett darstellen, wenn ordentlich) -->
          
          <td>${person.name}</td>
          <td>${person.mail}</td>
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


function lade_ersatzperson_mit_mg(eingeladen, mg_geschlecht, liste) {
    console.log(`Aufruf von lade_ersatzperson_mit_mg: mg_geschlecht=${mg_geschlecht}, liste=${liste}`);
    let ersatz;

    // MG-Person laden 
    ersatz = allePersonen
        .filter(person => person.geschlecht === mg_geschlecht && !person.ordentlich && person.anwesend && !eingeladen.includes(person) && person.liste === liste)
        .sort((a, b) => a.rang - b.rang)[0];

    // Falls keine MG-Person in derselben Liste gefunden wurde, eine beliebige MG-Person suchen
    if (!ersatz) {
        ersatz = allePersonen
            .filter(person => person.geschlecht === mg_geschlecht && !person.ordentlich && person.anwesend && !eingeladen.includes(person))
            .sort((a, b) => a.rang - b.rang)[0];
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
    //let nachgeladen_fuer = {}; // Dictionary, um nachzuhalten, für wen eine Ersatzperson nachgeladen wurde, entfällt wegen ersatz.nachladegrund.

    // Zunächst werden alle anwesenden ordentlichen Mitglieder eingeladen
    const ordentlicheMitglieder = allePersonen.filter(person => person.ordentlich);
    let fehlende_mitglieder = ordentlicheMitglieder.filter(person => !person.anwesend).length;

    // Hole die Einstellungen für das Minderheitengeschlecht und die Anzahl
    let mg_anzahl = parseInt(localStorage.getItem("geschlechtsanteil")) || 2;
    let mg_geschlecht = localStorage.getItem("geschlecht_mg") || "w";
    let eingeladenes_mg = 0;
   
    

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
            eingeladenes_mg = eingeladen.filter(person => person.geschlecht === mg_geschlecht).length;

            // Solange die Anzahl der fehlenden Mitglieder größer ist als die MG-Anzahl, lade nur Ersatzpersonen ohne MG
            // Ist ausreichend MG geladen, lade auch normal nach
            if (fehlende_mitglieder > mg_anzahl || eingeladenes_mg >= mg_anzahl) {
                ersatz = lade_ersatzperson_ohne_minderheit(eingeladen, person.liste);
                grund = `Nachgeladen für Rang ${person.rang}, Liste ${person.liste}`;
            }

            // Wenn die Anzahl der fehlenden Mitglieder kleiner oder gleich der MG-Anzahl ist, prüfe die MG-Quote
            else {      
              // Versuche, eine MG-Person zu laden
              ersatz = lade_ersatzperson_mit_mg(eingeladen, mg_geschlecht, person.liste);
              //wird eine MG-Person gefunden:
              if (ersatz) {
                  eingeladenes_mg++;
                  grund = `Nachgeladen wegen Minderheitengeschlecht (${mg_geschlecht}) für Rang ${person.rang}, Liste ${person.liste}`;
              }
              // Fallback: Falls keine MG-Person verfügbar ist, lade normale Ersatzperson
              else {
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

    return  eingeladen;
}

// Funktion zum Herunterladen der LocalStorage-Daten als JSON-Datei
function downloadLocalStorageData() {
    const data = localStorage.getItem("allePersonen");

    if (!data) {
        alert("Keine Daten zum Herunterladen vorhanden.");
        return;
    }

    // Erstelle ein Blob-Objekt mit dem JSON-Daten
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    // Erstelle einen temporären Download-Link
    const a = document.createElement("a");
    a.href = url;
    a.download = "personen_daten.json"; // Datei-Name

    // Füge den Link dem DOM hinzu und klicke ihn
    document.body.appendChild(a);
    a.click();

    // Entferne den Link nach dem Klicken
    document.body.removeChild(a);

    // Bereinige die URL nach dem Download
    URL.revokeObjectURL(url);
}


// Funktion zum Hochladen von Daten und Einfügen in den LocalStorage
function uploadLocalStorageData(event) {
    const file = event.target.files[0];

    if (!file) {
        alert("Keine Datei ausgewählt.");
        return;
    }

    // Prüfen, ob bereits Daten im localStorage existieren
    const existingData = localStorage.getItem("allePersonen");

    if (existingData) {
        // Bestätigungsdialog, wenn bereits Daten vorhanden sind
        const confirmation = confirm("Es existieren bereits Daten. Möchten Sie diese überschreiben?");
        if (!confirmation) {
            alert("Der Upload wurde abgebrochen.");
            return;  // Abbrechen, wenn der Benutzer nicht überschreiben möchte
        }
    }

    const reader = new FileReader();

    // FileReader lädt die Datei und schreibt sie in den localStorage
    reader.onload = function (e) {
        try {
            const jsonData = JSON.parse(e.target.result);
            // Speichere die hochgeladenen Daten in den localStorage
            localStorage.setItem("allePersonen", JSON.stringify(jsonData));

            // Aktualisiere die Anzeige
            allePersonen = ladePersonen();
            displayPersonen();

            alert("Daten erfolgreich hochgeladen.");

            // Optional: Seite neu laden, um alle Änderungen zu übernehmen
            location.reload(); // Neuladen der Seite nach dem Hochladen der Daten
        } catch (error) {
            console.error("Fehler beim Einfügen der Daten:", error);
            alert("Die Datei enthält keine gültigen Daten.");
        }
    };

    // Lese die Datei als Text ein
    reader.readAsText(file);
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


document.addEventListener("DOMContentLoaded", function () {
    // Event Listener für den "Alle Listen löschen"-Button
    document.getElementById("deleteAllButton").addEventListener('click', () => {
        const confirmation = confirm("Möchten Sie wirklich alle Einträge löschen?");
        
        if (confirmation) {
            loescheAlleListen();
            alert("Alle Einträge wurden gelöscht.");
        } else {
            console.log("Löschvorgang abgebrochen.");
        }
    });



    // Event Listener für den Download-Button
    const downloadButton = document.querySelector('.downloadButton');
    
    if (downloadButton) {
        downloadButton.addEventListener('click', downloadLocalStorageData);
    } else {
        console.error("Das Download-Button-Element konnte nicht gefunden werden.");
    }

    // Event Listener für den Upload-Button (Datei-Upload)
    const uploadButton = document.getElementById('fileUpload');  // Hier die ID 'fileUpload' statt 'uploadButton'
    
    if (uploadButton) {
        uploadButton.addEventListener('change', uploadLocalStorageData);
    } else {
        console.error("Das Upload-Button-Element konnte nicht gefunden werden.");
    }

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
        let eingeladen = eingeladene_personen()
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


