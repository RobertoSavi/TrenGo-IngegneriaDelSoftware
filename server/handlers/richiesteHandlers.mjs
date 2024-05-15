import * as richiestaModel from "../models/richiestaModel.mjs"
import * as propostaModel from "../models/propostaModel.mjs"
//import * as validators from "../validators/richiesteValidators.mjs";
import mongoose from "mongoose";

/**
 * Ottiene le richieste di partecipazione dal database.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function getRichieste(req, res){
    try {
        const idProposta = req.params.idProposta;
        const proposta = await propostaModel.Proposta.findById(idProposta);
        const loggedId = req.utenteLoggato.loggedId; // ID dell'utente loggato
        const richieste = await richiestaModel.Richiesta.find({idProposta});
        
        if (!richieste) {
            return res.status(400).json({message: "Nessuna richiesta trovata"});
        }

        // Restituisco le richieste alla proposta solo se sono il creatore della proposta
        if(loggedId==proposta.idCreatore.toString()){
            return res.status(200).json({richieste});
        }
        else{
            return res.status(403).json({message: "Impossibile ottenere le richieste alle proposte altrui"});
        }

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
        const idProposta = req.params.idProposta;
        const proposta = await propostaModel.Proposta.findById(idProposta);
        const loggedId = req.utenteLoggato.loggedId; // ID dell'utente loggato
        const richiesta = await richiestaModel.Richiesta.findById(id);
        
        if (!richiesta) {
            return res.status(400).json({message: "Richiesta non trovata"});
        }

        // Restituisco la richiesta alla proposta solo se sono il creatore della proposta
        if(loggedId==proposta.idCreatore.toString()){
            return res.status(200).json({richiesta});
        }
        else{
            return res.status(403).json({message: "Impossibile ottenere una richiesta ad una proposta altrui"});
        }

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
    try {
        const {richiedente, usernameRichiedente, proposta, titoloProposta} = req.body;
        const loggedId = req.utenteLoggato.loggedId; // ID dell'utente loggato
        
        const idRichiedente = new mongoose.Types.ObjectId(richiedente);
        const idProposta = new mongoose.Types.ObjectId(proposta);
        const propostaTrovata = await propostaModel.Proposta.findById(proposta);
        
        if(!propostaTrovata){
            console.log("Proposta non trovata.");
            return res.status(404).json({message: "Proposta non trovata"});
        }

        // Pubblico la richiesta solo se il richiedente è diverso dal creatore della proposta
        var richiesta;
        if(loggedId!=propostaTrovata.idCreatore.toString()){
            // Creazione della richiesta
            richiesta = await richiestaModel.Richiesta.create({idRichiedente, usernameRichiedente,idProposta, titoloProposta});
        }
        else{
            return res.status(403).json({message: "Impossibile richiedere di partecipare alle proprie proposte"});
        }
        return res.status(201).json({message: "success", self: "richieste/" + richiesta._id});

    } catch (error) {
        console.log(error);
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
        const idProposta = req.params.idProposta;
        const proposta = await propostaModel.Proposta.findById(idProposta);
        const loggedId = req.utenteLoggato.loggedId; // ID dell'utente loggato
        const stato = req.body;
        var richiesta = await richiestaModel.Richiesta.findById(id);

        if (!richiesta) {
            console.log("Richiesta non trovata.");
            return res.status(404).json({message: "Richiesta non trovata"});
        }

        // Modifico la richiesta solo se sono il creatore della proposta
        if(loggedId==proposta.idCreatore.toString()){
            // Aggiorna la richiesta cambiando il campo stato
            richiesta = await richiestaModel.Richiesta.findByIdAndUpdate(id, stato, {new: true});
            return res.status(200).json({
                self: "richeste/" + richiesta._id // Link alla risorsa dell'utente appena modificato
            });
        }
        else{
            return res.status(403).json({message: "Impossibile modificare una richiesta ad una proposta altrui"});
        }

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