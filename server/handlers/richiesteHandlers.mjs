import * as richiestaModel from "../models/richiestaModel.mjs"
//import * as validators from "../validators/richiesteValidators.mjs";
import mongoose from "mongoose";

/**
 * Ottiene le richieste di partecipazione dal database.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function getRichieste(req, res){
    try {
        const richieste = await richiestaModel.Richiesta.find();
        
        if (!richieste) {
            return res.status(400).json({message: "Nessuna richiesta pubblicata."});
        }
        return res.status(200).json({richieste});

    } catch (error) {
        return res.status(500).json({message: "Errore durante il recupero delle richieste", error: error.message});
    }
}

/**
 * Ottiene una richiesta di partecipazione dal database.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function getRichiestaById(req, res){
    try {
        const {id} = req.params;
        const richiesta = await richiestaModel.Richiesta.findById(id);
        
        if (!richiesta) {
            return res.status(400).json({message: "Richiesta non trovata"});
        }
        return res.status(200).json({richiesta});

    } catch (error) {
        return res.status(500).json({message: "Errore durante il recupero della richiesta", error: error.message});
    }
}

/**
 * Inserisce una richiesta nel database.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function postRichiesta(req, res){
    const {richiedente, usernameRichiedente, proposta, titoloProposta} = req.body;

    try {
        // Creazione della richiesta
        const idRichiedente = new mongoose.Types.ObjectId(richiedente);
        const idProposta = new mongoose.Types.ObjectId(proposta);
        const richiesta = await richiestaModel.Richiesta.create({idRichiedente, usernameRichiedente,idProposta, titoloProposta});
        return res.status(200).json({richiesta});

    } catch (error) {
        // Gestione dell'errore durante la creazione della richiesta
        return res.status(500).json({message: "Errore durante la creazione della richiesta", error: error.message});
    }
}

/**
 * Modifica una richiesta nel database
 * Permette di accettarla o rifiutarla
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function handleRichiestaById(req, res){
    try {
        const {id} = req.params;
        const stato = req.body;

        // Aggiorna la richiesta cambiando il campo stato
        const richiesta = await richiestaModel.Richiesta.findByIdAndUpdate(id, stato, {new: true});

        if (!richiesta) {
            console.log("Richiesta non trovata.");
            return res.status(404).json({message: "Richiesta non trovata"});
        }

        return res.status(200).json({richiesta});
    } catch (error) {
        return res.status(500).json({message: "Errore durante la modifica della richiesta", error: error.message});
    }
}

// Esporta handlers
export {
    getRichieste,
    getRichiestaById,
    postRichiesta,
    handleRichiestaById
};