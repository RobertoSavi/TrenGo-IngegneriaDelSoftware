import * as utenteModel from "../models/utenteModel.mjs"
import * as validators from "../validators/utentiValidators.mjs";
import jwt  from "jsonwebtoken"
// import ObjectId from "mongodb";

/**
 * Ottiene un utente dal database utilizzando l'ID fornito.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function getUtenteById(req, res) {
    try {
        const {id} = req.params;
        const utente = await utenteModel.Utente.findById(id);
        
        if (!utente) {
            console.log("Utente non trovato.");
            return res.status(400).json({message: "Utente non trovato"});
        }
        
        return res.status(200).json({utente});
    } catch (error) {
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
        const {id} = req.params;
        const updates = req.body;

        // Aggiorna il documento utente con tutti i campi forniti nel corpo della richiesta
        const utente = await utenteModel.Utente.findByIdAndUpdate(id, updates, {new: true});

        if (!utente) {
            return res.status(404).json({message: "Utente non trovato"});
        }
        return res.status(200).json({utente});

    } catch (error) {
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
        const {username} = req.params;

        // Trova l'utente nel database utilizzando lo username
        const utente = await utenteModel.Utente.findOne({username: username});

        if (!utente) {
            return res.status(400).json({message: "Utente non trovato"});
        }
        return res.status(200).json({utente});

    } catch (error) {
        return res.status(500).json({message: "Errore durante il recupero dell'utente", error: error.message});
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
    if (!validators.isUsernameValid(username)) 
        errors.push({field: "username", message: "Username non valido"});

    // Validazione dell'email
    if (!validators.isEmailValid(email)) 
        errors.push({field: "email", message: "Email non valida"});

    // Validazione della password
    if (!validators.isPasswordValid(password)) 
        errors.push({field: "password", message: "Password non valida"});

    // Verifica se lo username è già in uso
    if (await validators.isUsernameTaken(username)) 
        errors.push({field: "username", message: "Username già in uso"});

    // Verifica se l'email è già in uso
    if (await validators.isEmailTaken(email)) 
        errors.push({field: "email", message: "Email già registrata"});

    // Gestione degli errori
    if (errors.length > 0) 
        return res.status(400).json({message: "error", errors});

    try {
        // Creazione dell'utente
        await utenteModel.Utente.create({username, email, password});
        return res.status(200).json({message: "success"});

    } catch (error) {
        // Gestione dell'errore durante la creazione dell'utente
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
        // Find the user by username
        const utente = await validators.getUtente(username);

        // Ritorna errore, se l'utente non viene trovato
        if (!utente) {
            return res.status(401).json({success: false, message: 'Utente non trovato'});
        }

        // Verifica la password
        const isPasswordCorrect = await validators.verifyPasswordByUsername(username, password);

        // Ritorna errore se la password non è corretta
        if (!isPasswordCorrect) {
            return res.status(401).json({success: false, message: 'Password sbagliata'});
        }
        //TODO!! implementare token per autenticazione
        return res.status(200).json({utente});
        
    } catch (error) {
        return res.status(500).json({success: false, message: "Errore interno del server"});
    } 
}

// Esporta handlers
export {
    getUtenteById,
    updateUtenteById,
    getUtenteByUsername,
    signupUtente,
    loginUtente   
};