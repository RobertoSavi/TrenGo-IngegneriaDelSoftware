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
        const loggedId = req.utenteLoggato.loggedId; // ID dell'utente loggato
        
        if (!utente) {
            return res.status(404).json({message: "Utente non trovato"});
        }

        // Se l'utente cercato è uguale all'utente loggato resituisco tutte le informazioni dell'utente
        if(utente.id==loggedId){
            return res.status(200).json({utente});
        }

        // Altrimenti ritorna solo le informazioni pubbliche
        return res.status(200).json({
            username: utente.username, 
            tipoUtente: utente.tipoUtente,
            nome: utente.nome,
            cognome: utente.cognome,
            karma: utente.karma,
            interessi: utente.interessi
            });
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
        const loggedId = req.utenteLoggato.loggedId; // ID dell'utente loggato
        
        // Aggiorna il documento utente con tutti i campi forniti nel corpo della richiesta
        const utente = await utenteModel.Utente.findByIdAndUpdate(id, updates, {new: true});
        if (!utente) {
            return res.status(404).json({message: "Utente non trovato"});
        }
        
        // Permetto la modifica dei dati utente solo se il chiamante dell'API è l'utente da modificare
        if(utente.id==loggedId){
            // Aggiorna il documento utente con tutti i campi forniti nel corpo della richiesta
            const utente = await utenteModel.Utente.findByIdAndUpdate(id, updates, {new: true});
            return res.status(200).json({self: "utenti/" + utente._id});
        }
        else{
            return res.status(403).json({message: "Impossibile modificare account altrui"});
        }

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
        const loggedId = req.utenteLoggato.loggedId; // ID dell'utente loggatow

        // Trova l'utente nel database utilizzando lo username
        const utente = await utenteModel.Utente.findOne({username: username});

        if (!utente) {
            return res.status(404).json({message: "Utente non trovato"});
        }

        // Se l'utente cercato è uguale all'utente loggato resituisco tutte le informazioni dell'utente
        if(utente.id==loggedId){
            return res.status(200).json({utente});
        }

        // Altrimenti ritorna solo le informazioni pubbliche
        return res.status(200).json({
            "utente": {
                username: utente.username, 
                tipoUtente: utente.tipoUtente,
                nome: utente.nome,
                cognome: utente.cognome,
                karma: utente.karma,
                interessi: utente.interessi
            }
        });
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
        const utente = await utenteModel.Utente.create({username, email, password});
        return res.status(201).json({self: "utenti/" + utente._id});

    } catch (error) {
        // Gestione dell'errore durante la creazione dell'utente
        return res.status(500).json({message: "Errore durante la registrazione dell'utente", error: error.message});
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
        
        // Se l'utente è stato trovato e la password è corretta, crea un token JWT
        const payload = {
            loggedId: utente._id, // Aggiungi l'ID dell'utente come informazione nel payload del token
            loggedUsername: utente.username // Aggiungi l'username dell'utente come informazione nel payload del token
        };

        // Opzioni per la creazione del token JWT, incluso il tempo di scadenza
        const options = {
            expiresIn: process.env.JWT_EXPIRES_IN // Scadenza del token
        };

        // Crea un token JWT firmato utilizzando il payload, il segreto e le opzioni specificate
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, options);

        // Invia una risposta JSON contenente il token appena creato, insieme ad altre informazioni
        return res.status(200).json({
            token: token, // Il token JWT appena creato
            loggedId: utente._id, // ID dell'utente associato al token
            loggedUsername: utente.username, // Username dell'utente associato al token
            self: "utenti/" + utente._id // Link alla risorsa dell'utente nel formato API
        });
        
    } catch (error) {
        return res.status(500).json({message: "Errore durante l'accesso dell'utente", error: error.message});
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