import * as propostaModel from "../models/propostaModel.mjs"
import * as utenteModel from "../models/utenteModel.mjs"
import * as validators from "../validators/proposteValidators.mjs";
import mongoose from "mongoose";
//import {ObjectId} from "mongodb";

/**
 * Ottiene le proposte dal database.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function getProposte(req, res){
    try {
        const proposte = await propostaModel.Proposta.find();
        
        if (!proposte) {
            return res.status(400).json({message: "Nessuna proposta disponibile"});
        }
        return res.status(200).json({proposte});

    } catch (error) {
        return res.status(500).json({message: "Errore durante il recupero delle proposte", error: error.message});
    }
}

/**
 * Ottiene le proposte pubblicate da grandi organizzatori dal database (usato da utenti non autenticati).
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function getProposteNA(req, res){
    try {
        const grandiOrganizzatori = await utenteModel.Utente.find({
            "tipoUtente": "grandeOrganizzatore"
          });
        const proposte = await propostaModel.Proposta.find({
            "idCreatore": {
              $in: grandiOrganizzatori.map((u) => u._id)
            }
          });
        
        if (!proposte) {
            return res.status(400).json({message: "Nessuna proposta disponibile."});
        }
        return res.status(200).json({proposte});

    } catch (error) {
        return res.status(500).json({message: "Errore durante il recupero delle proposte", error: error.message});
    }
}

/**
 * Ottiene le proposte pubblicate dall'utente loggato
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function getMieProposte(req, res){
    try {
        const loggedUsername = req.utenteLoggato.loggedUsername; // Username dell'utente loggato
        const proposte = await propostaModel.Proposta.find({"usernameCreatore": loggedUsername});
        
        if (!proposte) {
            return res.status(400).json({message: "Nessuna proposta disponibile."});
        }
        return res.status(200).json({proposte});

    } catch (error) {
        return res.status(500).json({message: "Errore durante il recupero delle proposte", error: error.message});
    }
}

/**
 * Ottiene le proposte alle quali l'utente loggato partecipa
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function getProposteIscritto(req, res){
    try {
        const loggedUsername = req.utenteLoggato.loggedUsername; // Username dell'utente loggato
        const proposte = await propostaModel.Proposta.find({partecipanti: loggedUsername});
        
        if (!proposte) {
            return res.status(400).json({message: "Nessuna proposta disponibile."});
        }
        return res.status(200).json({proposte});

    } catch (error) {
        return res.status(500).json({message: "Errore durante il recupero delle proposte", error: error.message});
    }
}

/**
 * Ottiene una proposte dal database.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function getPropostaById(req, res){
    try {
        const {id} = req.params;
        const proposta = await propostaModel.Proposta.findById(id);
        
        if (!proposta) {
            return res.status(400).json({message: "Proposta non trovata"});
        }
        return res.status(200).json({proposta});

    } catch (error) {
        return res.status(500).json({message: "Errore durante il recupero della proposta", error: error.message});
    }
}

/**
 * Inserisce una proposta nel database.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function postProposta(req, res){
    const {usernameCreatore, titolo, categorie, nomeLuogo, descrizione, numeroPartecipantiDesiderato, data} = req.body;
    const errors = [];

    // Validazione delle categorie
    if (!validators.categorieInEnum(categorie)) 
        errors.push({field: "categorie", message: "Categorie non valide"});

    // Validazione del titolo
    if (!validators.validateTitolo(titolo)) 
        errors.push({field: "titolo", message: "Titolo troppo lungo o troppo corto"});

    // Validazione della descrizione
    if (!validators.validateDescrizione(descrizione)) 
        errors.push({field: "descrizione", message: "Descrizione troppo lunga"});

    // Gestione degli errori
    if (errors.length > 0) 
        return res.status(400).json({message: "error", errors});

    try {
        // Creazione della proposta
        const proposta = await propostaModel.Proposta.create({usernameCreatore, titolo, categorie, nomeLuogo, descrizione, numeroPartecipantiDesiderato, data});
        return res.status(201).json({self: "proposte/" + proposta._id});

    } catch (error) {
        // Gestione dell'errore durante la creazione della proposta
        return res.status(500).json({message: "Errore durante la creazione della proposta", error: error.message});
    }
}

/**
 * Modifica una proposta nel database
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function modifyPropostaById(req, res){
    try {
        const {id} = req.params;
        const updates = req.body;
        const loggedUsername = req.utenteLoggato.loggedUsername; // ID dell'utente loggato

        // Trovo la proposta da modificare
        var proposta = await propostaModel.Proposta.findById(id);

        if (!proposta) {
            return res.status(404).json({message: "Proposta non trovata"});
        }

        // Permetto la modifica dei dati utente solo se il chiamante dell'API è il creatore della proposta
        if(proposta.usernameCreatore==loggedUsername){
            // Aggiorna il documento proposta con tutti i campi forniti nel corpo della richiesta
            proposta=await propostaModel.Proposta.findByIdAndUpdate(id, updates, {new: true});
        }
        else{
            return res.status(403).json({message: "Impossibile modificare proposte altrui"});
        }

        return res.status(200).json({proposta});
    } catch (error) {
        return res.status(500).json({message: "Errore durante la modifica della proposta", error: error.message});
    }
}

/**
 * Elimina una proposta dal database
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function deletePropostaById(req, res){
    try {
        const {id} = req.params;
        const loggedUsername = req.utenteLoggato.loggedUsername; // ID dell'utente loggato

        // Trovo la proposta da modificare
        var proposta = await propostaModel.Proposta.findById(id);

        if (!proposta) {
            return res.status(404).json({message: "Proposta non trovata"});
        }

        // Permetto la modifica dei dati utente solo se il chiamante dell'API è il creatore della proposta
        if(proposta.usernameCreatore==loggedUsername){
            // Trova e elimina la proposta dal database
            await propostaModel.Proposta.findByIdAndDelete(id);
        }
        else{
            return res.status(403).json({message: "Impossibile eliminare proposte altrui"});
        }
        return res.status(204).json({message: "Proposta eliminata con successo"});

    } catch (error) {
        return res.status(500).json({message: "Errore durante l'eliminazione della proposta", error: error.message});
    }
}

// Esporta handlers
export {
    getProposte,
    getProposteNA,
    getMieProposte,
    getProposteIscritto,
    getPropostaById,
    postProposta,
    modifyPropostaById,
    deletePropostaById
};