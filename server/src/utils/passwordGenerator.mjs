function generateRandomPassword() {
    // Definisce i set di caratteri: lettere maiuscole, lettere minuscole, cifre e caratteri speciali
    const lettereMaiuscole = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lettereMinuscole = 'abcdefghijklmnopqrstuvwxyz';
    const cifre = '0123456789';
    const caratteriSpeciali = '!@#$%^&*()_+-=[]{};:\'"\\|,.<>/?';
    const tuttiICaratteri = lettereMaiuscole + lettereMinuscole + cifre + caratteriSpeciali;

    // Funzione helper per ottenere un carattere casuale da un set di caratteri dato
    const ottieniCarattereCasuale = (caratteri) => {
        return caratteri[Math.floor(Math.random() * caratteri.length)];
    };

    // Assicura che ci sia almeno un carattere da ciascun set
    const password = [
        ottieniCarattereCasuale(lettereMaiuscole),   // Aggiunge una lettera maiuscola
        ottieniCarattereCasuale(lettereMinuscole),   // Aggiunge una lettera minuscola
        ottieniCarattereCasuale(cifre),              // Aggiunge un numero
        ottieniCarattereCasuale(caratteriSpeciali)   // Aggiunge un carattere speciale
    ];

    // Riempie il resto della password fino alla lunghezza desiderata, ad esempio, 12 caratteri
    const lunghezzaDesiderata = 12;
    for (let i = password.length; i < lunghezzaDesiderata; i++) {
        password.push(ottieniCarattereCasuale(tuttiICaratteri));
    }

    // Mescola l'array di caratteri della password per assicurare casualità
    for (let i = password.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [password[i], password[j]] = [password[j], password[i]];
    }

    // Unisce l'array di caratteri in una stringa e la restituisce
    return password.join('');
}

// Esporta la funzione per poterla utilizzare in altri moduli
export {
    generateRandomPassword
}