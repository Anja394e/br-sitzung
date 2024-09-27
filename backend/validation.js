// Funktion zur Validierung, ob der Listenplatz in der jeweiligen Liste bereits vergeben ist
function istListenplatzVergeben(liste, listenplatz, ordentliche_mitglieder, ersatz_personen) {
    let listenplatz_vergeben = false;

    if (liste === 1) {
        // Prüfe, ob der Listenplatz bei den ordentlichen Mitgliedern vergeben ist
        listenplatz_vergeben = ordentliche_mitglieder.some(person => person.listenplatz === listenplatz);
    } else if (liste === 2) {
        // Prüfe, ob der Listenplatz bei den Ersatzpersonen vergeben ist
        listenplatz_vergeben = ersatz_personen.some(person => person.listenplatz === listenplatz);
    }

    return listenplatz_vergeben;
}

// Funktion zur Validierung von Daten wie Listenplatz und anderen Formularfeldern
function validierePerson(liste, listenplatz, ordentliche_mitglieder, ersatz_personen) {
    // Prüfen, ob der Listenplatz eine gültige Zahl ist
    if (isNaN(listenplatz) || listenplatz <= 0) {
        return { valid: false, message: "Der Listenplatz ist ungültig. Bitte geben Sie eine gültige Zahl ein." };
    }

    // Prüfen, ob der Listenplatz bereits vergeben ist
    if (istListenplatzVergeben(liste, listenplatz, ordentliche_mitglieder, ersatz_personen)) {
        return { valid: false, message: "Der Listenplatz " + listenplatz + " ist in dieser Liste bereits vergeben." };
    }

    // Wenn alles korrekt ist
    return { valid: true };
}

// Exportiere die Validierungsfunktionen für die Verwendung in anderen Dateien
export { istListenplatzVergeben, validierePerson };
