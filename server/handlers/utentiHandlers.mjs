import {isUsernameValid, isEmailValid, isPasswordValid, isUsernameTaken, isEmailTaken}from "../validators/utentiValidators.mjs";
import Utente from "../models/utenteModel.mjs"
import jwt  from "jsonwebtoken"

/**
 * Ottiene un utente dal database utilizzando l'ID fornito.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function getUtenteById(req, res) {
    try {
        const { id } = req.params;
        const utente = await Utente.findById(id);
        
        if (!utente) {
            console.log("Utente non trovato.");
            return res.status(400).json({message: "Utente non trovato"});
        }
        
        console.log("Utente recuperato con successo.");
        return res.status(200).json({utente: utente});
    } catch (error) {
        console.error("Errore durante il recupero dell'utente:", error);
        return res.status(500).json({message: "Errore durante il recupero dell'utente", error: error.message});
    }
}

/**
 * Aggiorna un utente nel database utilizzando l'ID fornito e i dati di aggiornamento.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function updateUtenteById(req, res) {
    try {
        const id = req.params;
        const updates = req.body;

        // Aggiorna il documento utente con tutti i campi forniti nel corpo della richiesta
        const utente = await Utente.findByIdAndUpdate(id, updates, {new: true});

        if (!utente) {
            console.log("Utente non trovato.");
            return res.status(404).json({message: "Utente non trovato"});
        }

        console.log("Utente aggiornato con successo.");
        return res.status(200).json({utente});
    } catch (error) {
        console.error("Errore durante l'aggiornamento dell'utente:", error);
        return res.status(500).json({message: "Errore durante l'aggiornamento dell'utente", error: error.message});
    }
}

/**
 * Ottiene un utente dal database utilizzando l'username fornito.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function getUtenteByUsername(req, res) {
    try {
        // Estrai l'username dal corpo della richiesta
        const username = req.params;

        // Trova l'utente nel database utilizzando lo username
        const utente = await Utente.findOne({username}).exec();
        
        if (utente) {
            // Se l'utente è stato trovato, restituisci le informazioni dell'utente
            return res.status(200).json({utente});
        } else {
            // Se l'utente non è stato trovato, restituisci uno status code 404 (Not Found)
            return res.status(404).json({message: "Utente non trovato"});
        }
    } catch (error) {
        console.error("Errore durante il recupero dell'utente per username:", error);
        // Se si verifica un errore, restituisci uno status code 500 (Internal Server Error)
        return res.status(500).json({ message: "Errore interno del server" });
    }
}

/**
 * Effettua la registrazione di un utente con i dati passati nel body
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function signupUtente(req, res) {
    // Estrai username, email e password dal body della richiesta
    const {username, email, password} = req.body;
    // Inizializza un array per gli errori
    const errors = [];

    // Validazione dello username
    if (!isUsernameValid(username)) 
        errors.push({ field: "username", message: "Username non valido" });

    // Validazione dell'email
    if (!isEmailValid(email)) 
        errors.push({ field: "email", message: "Email non valida" });

    // Validazione della password
    if (!isPasswordValid(password)) 
        errors.push({ field: "password", message: "Password non valida" });

    // Verifica se l'email è già in uso
    if (await isEmailTaken(email)) 
        errors.push({ field: "email", message: "Email già registrata" });

    // Verifica se lo username è già in uso
    if (await isUsernameTaken(username)) 
        errors.push({ field: "username", message: "Username già in uso" });

    // Gestione degli errori
    if (errors.length > 0) 
        return res.status(400).json({ message: "error", errors });

    try {
        // Creazione dell'utente
        await UserModel.create({ email, password, username });
        return res.status(200).json({ message: "success" });
    } catch (error) {
        // Gestione dell'errore durante la creazione dell'utente
        console.error("Errore durante la registrazione dell'utente:", error);
        return res.status(500).json({ message: "error", reason: "Errore interno del server" });
    }
}

/**
 * Effettua il login di un utente con i dati passati nel body
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function loginUtente(req, res){
    // Estrai username e password dal body della richiesta
    const {username, password} = req.body;

    try {
        // Find the user by email
        const utente = await getUtenteByUsername(username);

        // Ritorna errore, se l'utente non viene trovato
        if (!utente) {
            return res.status(401).json({ success: false, message: 'Utente non trovato' });
        }

        // Verifica la password
        const isPasswordCorrect = await Utente.isPasswordCorrect(password);

        // Ritorna errore se la password non è corretta
        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, message: 'Password sbagliata' });
        }
        //TODO!! implementare token per autenticazione
        return res.status(200).json();
    } catch (error) {
        console.error("Errore nel login:", error);
        return res.status(500).json({ success: false, message: "Errore interno del server" });
    } 
}

// Esporta handlers
module.exports = {
    getUtenteById,
    updateUtenteById,
    getUtenteByUsername,
    signupUtente,
    loginUtente   
};