// Ensure the DOM is fully loaded before trying to access elements
// Beim Laden der Einstellungsseite den aktuellen Wert aus localStorage setzen
window.addEventListener("load", function() {
    const form = document.getElementById("einstellungenForm");
    if (form) {
        // Speichern des neuen Wertes im localStorage, wenn das Formular abgeschickt wird
        form.addEventListener("submit", function(e) {
            e.preventDefault();

            // Get the value from the input field
            const geschlechtsanteil = document.getElementById("geschlechtsanteil").value;

            // Save the value in localStorage
            localStorage.setItem("geschlechtsanteil_w", geschlechtsanteil);

            // Show a success message
            alert("Einstellungen gespeichert!");
        });
    } else {
        console.error("Form element not found");
    }
});
