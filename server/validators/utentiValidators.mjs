import Utente from "../models/utenteModel.mjs"
import bcrypt from "bcrypt";

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
 * Verifica se un username è già presente nel database.
 * @param {string} username - L'username da controllare.
 * @returns {Promise<boolean>} - Una Promise che risolve a true se lo username è già presente, altrimenti false.
 */
async function isUsernameTaken(username) {
    // Esegui una query nel database per verificare se lo username è già presente
    const utente = await Utente.findOne({username});
    return !!utente; // Ritorna true se lo username è già presente, altrimenti false
}

/**
 * Verifica se un'email è già presente nel database.
 * @param {string} email - L'email da controllare.
 * @returns {Promise<boolean>} - Una Promise che risolve a true se l'email è già presente, altrimenti false.
 */
async function isEmailTaken(email) {
    // Esegui una query nel database per verificare se l'email è già presente
    const utente = await Utente.findOne({email});
    return !!utente; // Ritorna true se l'email è già presente, altrimenti false
}

/**
 * Verifica se la password corrisponde a quella memorizzata nel database per un determinato utente.
 * @param {string} email - L'email dell'utente.
 * @param {string} password - La password inserita dall'utente.
 * @returns {Promise<boolean>} - Una Promise che risolve a true se la password è corretta, altrimenti false.
 */

async function verifyPasswordByUsername(username, password) {
    try {
        // Trova l'utente nel database utilizzando lo username
        const utente = await Utente.findOne({username});
        // Use bcrypt to compare the provided password with the hashed one stored in the database
        return await bcrypt.compare(password, utente.password);
    }
    catch (error) {
        console.error("Errore nel login:", error);
        return false; // Return false to indicate login failure
    }
}

/**
 * Trova un utente nel database utilizzando l'username fornito.
 * @param {string} username - L'username dell'utente da trovare.
 * @returns {Promise<object|null>} - Una promise che restituisce l'utente trovato o null se non trovato.
 */
async function getUtente(username) {
    try {
        // Trova l'utente nel database utilizzando lo username
        const utente = await Utente.findOne({username}).exec();
        return utente; // Restituisce l'utente trovato o null se non trovato
    } catch (error) {
        console.error("Errore durante il recupero dell'utente per username:", error);
        throw error; // Rilancia l'errore in caso di problemi
    }
}

// Esporta validatori
export {
    isUsernameValid,
    isEmailValid,
    isPasswordValid,
    isUsernameTaken,
    isEmailTaken,
    verifyPasswordByUsername,
    getUtente
};