document.getElementById("einstellungenForm").addEventListener("submit", function(e) {
    e.preventDefault();

    // Hole den neuen Wert aus dem Eingabefeld
    const geschlechtsanteil = document.getElementById("geschlechtsanteil").value;

    // Speichere den Wert im localStorage
    localStorage.setItem("geschlechtsanteil_w", geschlechtsanteil);

    // Zeige eine Erfolgsmeldung an
    alert("Einstellungen gespeichert!");
});
