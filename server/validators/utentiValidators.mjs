import Utente from './models/utenteModel.js'

// Queste funzioni servono a validare i campi necessari per la registrazione e il login di un utente

/**
 * Funzione per validare un username.
 * @param {string} username - L'username da validare.
 * @returns {boolean} - True se l'username è valido, altrimenti False.
 */
function isUsernameValid(username) {
    // L'username deve essere lungo tra 3 e 20 caratteri e può contenere solo caratteri alfanumerici e underscore
    return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

/**
 * Funzione per validare un indirizzo email.
 * @param {string} email - L'indirizzo email da validare.
 * @returns {boolean} - True se l'indirizzo email è valido, altrimenti False.
 */
function isEmailValid(email) {
    // Utilizziamo una regex per validare il formato dell'email
    // Questa regex potrebbe non coprire tutti i formati email validi, ma è una buona approssimazione
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Funzione per validare una password.
 * @param {string} password - La password da validare.
 * @returns {boolean} - True se la password è valida, altrimenti False.
 */
function isPasswordValid(password) {
    // La password deve essere lunga almeno 8 caratteri e contenere almeno una lettera maiuscola, una minuscola, un numero e un carattere speciale
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
}

/**
 * Funzione per verificare se una password è considerata forte.
 * @param {string} password - La password da verificare.
 * @returns {boolean} - True se la password è forte, altrimenti False.
 */
function isPasswordStrong(password) {
    // La password deve avere almeno 8 caratteri
    const isLengthyEnough = password.length >= 8;
    // La password deve contenere almeno una lettera maiuscola
    const hasUpperCase = /[A-Z]/.test(password);
    // La password deve contenere almeno una lettera minuscola
    const hasLowerCase = /[a-z]/.test(password);
    // La password deve contenere almeno un numero
    const hasDigit = /\d/.test(password);
    // La password deve contenere almeno un carattere speciale
    const hasSpecialChar = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    // La password deve soddisfare tutti i criteri di robustezza
    return isLengthyEnough && hasUpperCase && hasLowerCase && hasDigit && hasSpecialChar;
}

/**
 * Verifica se un username è già presente nel database.
 * @param {string} username - L'username da controllare.
 * @returns {Promise<boolean>} - Una Promise che risolve a true se lo username è già presente, altrimenti false.
 */
async function isUsernameTaken(username) {
    // Esegui una query nel database per verificare se lo username è già presente
    const user = await Utente.findOne({ username });
    return !!user; // Ritorna true se lo username è già presente, altrimenti false
}

/**
 * Verifica se un'email è già presente nel database.
 * @param {string} email - L'email da controllare.
 * @returns {Promise<boolean>} - Una Promise che risolve a true se l'email è già presente, altrimenti false.
 */
async function isEmailTaken(email) {
    // Esegui una query nel database per verificare se l'email è già presente
    const user = await Utente.findOne({ email });
    return !!user; // Ritorna true se l'email è già presente, altrimenti false
}

module.exports = {  
    isUsernameValid,
    isEmailValid,
    isPasswordValid,
    isPasswordStrong,
    isUsernameTaken,
    isEmailTaken
};