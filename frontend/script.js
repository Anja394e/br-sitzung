// Globale Variable für die Mindestanzahl an weiblichen Personen, die eingeladen werden müssen
let geschlechtsanteil_w = 2;

class Person {
    constructor(liste, listenplatz, geschlecht, name, mail, anwesend) {
        this.liste = liste;
        this.listenplatz = listenplatz;
        this.geschlecht = geschlecht;
        this.name = name;
        this.mail = mail;
        this.anwesend = anwesend;
    }

    // String-Repräsentation der Person, für die Ausgabe
    toString() {
        return `Person(Liste: ${this.liste}, Listenplatz: ${this.listenplatz}, Geschlecht: ${this.geschlecht}, Name: ${this.name}, E-Mail: ${this.mail}, Anwesend: ${this.anwesend})`;
    }
}

// Funktion, um die eingeladenen Personen zu ermitteln
function eingeladene_personen(ordentliche_mitglieder, ersatz_personen) {
    let eingeladen = []; // Liste der final eingeladenen Personen
    let nachgeladen_fuer = {}; // Dictionary, um nachzuhalten, für welches ordentliche Mitglied eine Ersatzperson nachgeladen wurde

    function anzahl_weiblich() {
        return eingeladen.filter(person => person.geschlecht === 'w').length;
    }

    function finde_ersatzperson(geschlecht) {
        return ersatz_personen.find(ersatz => ersatz.geschlecht === geschlecht && !eingeladen.includes(ersatz) && ersatz.anwesend);
    }

    function entferne_letzte_maennliche_person() {
        for (let i = eingeladen.length - 1; i >= 0; i--) {
            if ((eingeladen[i].geschlecht === 'm' || eingeladen[i].geschlecht === 'd') && eingeladen[i].liste === 2) {
                return eingeladen.splice(i, 1)[0];
            }
        }
        return null;
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

    // Jetzt wird überprüft, ob die Mindestanzahl an weiblichen Personen erreicht ist
    while (anzahl_weiblich() < geschlechtsanteil_w) {
        let entfernte_person = entferne_letzte_maennliche_person();
        if (entfernte_person) {
            let weibliche_ersatz = finde_ersatzperson('w');
            if (weibliche_ersatz) {
                let ordentliche_person = Object.entries(nachgeladen_fuer).find(([k, v]) => k === entfernte_person.name)?.[1];
                eingeladen.push(weibliche_ersatz);
                if (ordentliche_person) {
                    nachgeladen_fuer[weibliche_ersatz.name] = `${ordentliche_person} (wegen Minderheitengeschlecht, ersetzt ${entfernte_person.name})`;
                }
            } else {
                console.log("Keine weiteren weiblichen Ersatzpersonen verfügbar");
                break;
            }
        } else {
            console.log("Keine weiteren männlichen oder divers geschlechtlichen Ersatzpersonen zum Entfernen verfügbar");
            break;
        }
    }

    return { eingeladen, nachgeladen_fuer };
}

// Beispielhafte Daten für ordentliche Mitglieder (Liste 1) und Ersatzmitglieder (Liste 2)
let ordentliche_mitglieder = [
    new Person(1, "1", "w", "Anna Müller", "anna.mueller@example.com", false),
    new Person(1, "2", "m", "Max Mustermann", "max.mustermann@example.com", false),
    new Person(1, "3", "w", "Lisa Schmidt", "lisa.schmidt@example.com", false),
    new Person(1, "4", "m", "Jonas Weber", "jonas.weber@example.com", true),
    new Person(1, "5", "m", "Paul Fischer", "paul.fischer@example.com", true),
];

let ersatz_personen = [
    new Person(2, "E1", "m", "Erik Meyer", "erik.meyer@example.com", true),
    new Person(2, "E2", "m", "Leon Bauer", "leon.bauer@example.com", false),
    new Person(2, "E3", "w", "Sophie Becker", "sophie.becker@example.com", true),
    new Person(2, "E4", "d", "Alex Jordan", "alex.jordan@example.com", true),
    new Person(2, "E5", "w", "Clara Wagner", "clara.wagner@example.com", false),
    new Person(2, "E6", "w", "Eva Hofmann", "eva.hofmann@example.com", true),
    new Person(2, "E7", "m", "Tom Schulz", "tom.schulz@example.com", false),
    new Person(2, "E8", "m", "Felix Neumann", "felix.neumann@example.com", true),
    new Person(2, "E9", "w", "Nina Wolf", "nina.wolf@example.com", false),
];

// Event Listener für den "Einladen"-Button
document.getElementById("einladenButton").addEventListener("click", () => {
    // Berechne die eingeladenen Personen
    let { eingeladen, nachgeladen_fuer } = eingeladene_personen(ordentliche_mitglieder, ersatz_personen);

    // Ausgabe der eingeladenen Personen in der HTML-Liste
    let ergebnisListe = document.getElementById("eingeladenePersonen");
    ergebnisListe.innerHTML = ""; // Vorherige Einträge löschen

    eingeladen.forEach(person => {
        let li = document.createElement("li");
        li.textContent = person.name + (nachgeladen_fuer[person.name] ? ` (nachgeladen für ${nachgeladen_fuer[person.name]})` : "");
        ergebnisListe.appendChild(li);
    });
});
