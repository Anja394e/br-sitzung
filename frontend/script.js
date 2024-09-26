// Globale Variable für die Mindestanzahl an weiblichen Personen, die eingeladen werden müssen
let geschlechtsanteil_w = 2;

class Person {
    /**
     * Klasse zur Repräsentation einer Person mit den Attributen Liste, Listenplatz, Geschlecht, Name, E-Mail und Anwesenheit.
     */
    constructor(liste, listenplatz, geschlecht, name, mail, anwesend) {
        this.liste = liste; // Identifiziert, ob die Person ein ordentliches Mitglied (Liste 1) oder ein Ersatzmitglied (Liste 2) ist
        this.listenplatz = listenplatz; // Platzierung auf der Liste (wichtig bei Ersatzmitgliedern)
        this.geschlecht = geschlecht; // Geschlecht der Person: 'm' für männlich, 'w' für weiblich, 'd' für divers
        this.name = name; // Name der Person
        this.mail = mail; // E-Mail-Adresse der Person
        this.anwesend = anwesend; // Boolean-Wert, ob die Person anwesend ist oder nicht
    }

    // String-Repräsentation der Person, für die Ausgabe in der Konsole
    toString() {
        return `Person(Liste: ${this.liste}, Listenplatz: ${this.listenplatz}, Geschlecht: ${this.geschlecht}, Name: ${this.name}, E-Mail: ${this.mail}, Anwesend: ${this.anwesend})`;
    }
}

// Funktion, um die eingeladenen Personen zu ermitteln
function eingeladene_personen(ordentliche_mitglieder, ersatz_personen) {
    let eingeladen = []; // Liste der final eingeladenen Personen
    let nachgeladen_fuer = {}; // Dictionary, um nachzuhalten, für welches ordentliche Mitglied eine Ersatzperson nachgeladen wurde

    // Berechnet die Anzahl der weiblichen Personen unter den eingeladenen Personen
    function anzahl_weiblich() {
        return eingeladen.filter(person => person.geschlecht === 'w').length;
    }

    // Sucht eine Ersatzperson eines bestimmten Geschlechts
    function finde_ersatzperson(geschlecht) {
        return ersatz_personen.find(ersatz => ersatz.geschlecht === geschlecht && !eingeladen.includes(ersatz) && ersatz.anwesend);
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

    // Falls ordentliche Mitglieder fehlen, werden Ersatzpersonen nachgeladen
    ordentliche_mitglieder.forEach(person => {
        if (!person.anwesend) {
            let beliebige_ersatz = finde_ersatzperson('m') || finde_ersatzperson('w') || finde_ersatzperson('d');
            if (beliebige_ersatz && !eingeladen.includes(beliebige_ersatz)) {
                eingeladen.push(beliebige_ersatz);
                nachgeladen_fuer[beliebige_ersatz.name] = person.name;
            }
        }
    });

    // Jetzt wird überprüft, ob die Mindestanzahl an weiblichen
