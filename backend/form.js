import { Person, allePersonen, speicherePersonen } from './person.js'; // Import der notwendigen Variablen und Funktionen
import { displayPersonen } from './ui.js'; // Import der displayPersonen Funktion aus ui.js

// Listen aus dem localStorage laden oder initialisieren
let listen = JSON.parse(localStorage.getItem('listen')) || [];

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

    if (!liste) {
        alert('Bitte wählen Sie eine Liste aus oder geben Sie eine neue Liste ein.');
        return;
    }

    // Überprüfen, ob die Kombination aus Listenplatz und Liste bereits existiert
    let bereitsVorhanden = allePersonen.some(p => p.listenplatz === listenplatz && p.liste === liste);

    if (bereitsVorhanden) {
        alert('Eine Person mit diesem Listenplatz existiert bereits in dieser Liste.');
        return; // Verhindert das Hinzufügen der Person
    }

    // Neue Person erstellen
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
});

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
    dropdown.innerHTML = '<option value="">Liste auswählen</option>';
    listen.forEach(liste => {
        let option = document.createElement("option");
        option.value = liste;
        option
