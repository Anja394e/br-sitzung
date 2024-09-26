// Beim Laden der Einstellungsseite den aktuellen Wert aus localStorage setzen
window.addEventListener("load", function() {
    const geschlechtsanteil_w = localStorage.getItem("geschlechtsanteil_w");
    if (geschlechtsanteil_w) {
        document.getElementById("geschlechtsanteil").value = geschlechtsanteil_w; // Setzt den Wert in das Eingabefeld
    }
});

// Speichern des neuen Wertes im localStorage, wenn das Formular abgeschickt wird
document.getElementById("einstellungenForm").addEventListener("submit", function(e) {
    e.preventDefault();

    // Hole den neuen Wert aus dem Eingabefeld
    const geschlechtsanteil = document.getElementById("geschlechtsanteil").value;

    // Speichere den Wert im localStorage
    localStorage.setItem("geschlechtsanteil_w", geschlechtsanteil);

    // Zeige eine Erfolgsmeldung an
    alert("Einstellungen gespeichert!");
});
