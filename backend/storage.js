function speicherePersonen() {
    localStorage.setItem("ordentliche_mitglieder", JSON.stringify(ordentliche_mitglieder));
    localStorage.setItem("ersatz_personen", JSON.stringify(ersatz_personen));
}
