// Beim Laden der Einstellungsseite den aktuellen Wert aus localStorage setzen
window.addEventListener("load", function() {
    const form = document.getElementById("einstellungenForm");
    if (form) {
        // Setze die aktuellen Werte im Formular, falls vorhanden
        document.getElementById("geschlechtsanteil").value = localStorage.getItem("geschlechtsanteil") || 2;
        document.getElementById("geschlecht_mg").value = localStorage.getItem("geschlecht_mg") || "w";

        // Speichern des neuen Wertes im localStorage, wenn das Formular abgeschickt wird
        form.addEventListener("submit", function(e) {
            e.preventDefault();

            // Hole die Werte aus den Eingabefeldern
            const geschlechtsanteil = document.getElementById("geschlechtsanteil").value;
            const geschlecht_mg = document.getElementById("geschlecht_mg").value;

            // Speichere die Werte im localStorage
            localStorage.setItem("geschlechtsanteil", geschlechtsanteil);
            localStorage.setItem("geschlecht_mg", geschlecht_mg);

            // Zeige eine Erfolgsmeldung
            alert("Einstellungen gespeichert!");
        });
    } else {
        console.error("Form element not found");
    }
});
