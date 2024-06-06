import Richiesta from "../models/richiestaModel.mjs"
import Proposta from "../models/propostaModel.mjs"
import validateStato from "../validators/richiesteValidators.mjs";
import mongoose from "mongoose";

const HOST_PROPOSTE = 'proposte/';

/**
 * Ottiene le richieste di partecipazione dal database.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function getRichieste(req, res) {
    try {
        const idProposta = req.params.idProposta;
        const proposta = await Proposta.findById(idProposta);
        const loggedUsername = req.utenteLoggato.loggedUsername; // Username dell'utente loggato
        const richieste = await Richiesta.find({ idProposta, stato: "pending" });

        if (!proposta) {
            return res.status(404).json({ message: "Proposta non trovata" });
        }

        if (!richieste) {
            return res.status(404).json({ message: "Nessuna richiesta trovata" });
        }

        // Restituisco le richieste alla proposta solo se sono il creatore della proposta
        if (loggedUsername == proposta.usernameCreatore.toString()) {
            return res.status(200).json({ richieste });
        }
        else {
            return res.status(403).json({ message: "Impossibile ottenere le richieste alle proposte altrui" });
        }

    } catch (error) {
        return res.status(500).json({ message: "Errore durante il recupero delle richieste", error: error.message });
    }
}

/**
 * Ottiene una richiesta di partecipazione dal database.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function getRichiestaById(req, res) {
    try {
        const id = req.params.id;
        const idProposta = req.params.idProposta;
        const proposta = await Proposta.findById(idProposta);
        const loggedUsername = req.utenteLoggato.loggedUsername; // Username dell'utente loggato
        const richiesta = await Richiesta.findById(id);

        if (!proposta) {
            return res.status(404).json({ message: "Proposta non trovata" });
        }

        if (!richiesta) {
            return res.status(404).json({ message: "Richiesta non trovata" });
        }

        // Restituisco la richiesta alla proposta solo se sono il creatore della proposta
        if (loggedUsername == proposta.usernameCreatore.toString()) {
            return res.status(200).json({ richiesta });
        }
        else {
            return res.status(403).json({ message: "Impossibile ottenere una richiesta ad una proposta altrui" });
        }

    } catch (error) {
        return res.status(500).json({ message: "Errore durante il recupero della richiesta", error: error.message });
    }
}

/**
 * Inserisce una richiesta nel database.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
/*async function postRichiesta(req, res) {
    try {
        const idProposta = req.params.idProposta;
        const { usernameRichiedente } = req.body;
        const loggedUsername = req.utenteLoggato.loggedUsername; // Username dell'utente loggato

        const proposta = await Proposta.findById(idProposta);

        if (!proposta) {
            return res.status(404).json({ message: "Proposta non trovata" });
        }

        const titoloProposta = proposta.titolo;
        // Pubblico la richiesta solo se il richiedente è diverso dal creatore della proposta   
        var richiesta;
        if (loggedUsername != proposta.usernameCreatore.toString()) {
            // Creazione della richiesta
            richiesta = await Richiesta.create({ usernameRichiedente, idProposta, titoloProposta });
        }
        else {
            return res.status(403).json({ message: "Impossibile richiedere di partecipare alle proprie proposte" });
        }
        return res.status(201).json({ self: "richieste/" + richiesta._id });

    } catch (error) {
        // Gestione dell'errore durante la creazione della richiesta
        return res.status(500).json({ message: "Errore durante la creazione della richiesta", error: error.message });
    }
}*/

async function postRichiesta(req, res) {
    try {
        const idProposta = req.params.idProposta;
        const { usernameRichiedente } = req.body;
        const loggedUsername = req.utenteLoggato.loggedUsername; // Username dell'utente loggato

        const proposta = await Proposta.findById(idProposta);

        if (!proposta) {
            return res.status(404).json({ message: "Proposta non trovata" });
        }

        const titoloProposta = proposta.titolo;
        // Pubblico la richiesta solo se il richiedente è diverso dal creatore della proposta   
        var richiesta;
        if (loggedUsername != proposta.usernameCreatore.toString()) {
            // Creazione della richiesta
            richiesta = await Richiesta.create({ usernameRichiedente, idProposta, titoloProposta });
            const propostaUrl = `${HOST_PROPOSTE}${proposta._id}`;
            // Creo una notifica per il creatore della proposta
            await Notifica.create({
                sorgente: 'System',
                username: utente.username,
                messaggio: `L'utente ${loggedUsername} ha richiesto di partecipare alla proposta: ${proposta.titolo}`,
                link: propostaUrl,
                tipo: tipoNotificaEnum.PROPOSTA
            });
        }
        else {
            return res.status(403).json({ message: "Impossibile richiedere di partecipare alle proprie proposte" });
        }
        return res.status(201).json({ self: "richieste/" + richiesta._id });

    } catch (error) {
        // Gestione dell'errore durante la creazione della richiesta
        return res.status(500).json({ message: "Errore durante la creazione della richiesta", error: error.message });
    }
}

/**
 * Modifica una richiesta nel database
 * Permette di accettarla o rifiutarla
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
/*async function handleRichiestaById(req, res) {
    try {
        const id = req.params.id;
        const idProposta = req.params.idProposta;
        const proposta = await Proposta.findById(idProposta);
        const loggedUsername = req.utenteLoggato.loggedUsername; // Username dell'utente loggato
        const stato = req.body;
        var richiesta = await Richiesta.findById(id);
        const errors = [];

        if (!proposta) {
            return res.status(404).json({ message: "Proposta non trovata" });
        }

        if (!richiesta) {
            return res.status(404).json({ message: "Richiesta non trovata" });
        }

        if (!validateStato(stato.stato))
            errors.push({ field: "stato", message: "Stato non valido - stati accettati['accettata','rifiutata']" });

        // Gestione degli errori
        if (errors.length > 0)
            return res.status(400).json({ message: "error", errors });

        // Modifico la richiesta solo se sono il creatore della proposta
        if (loggedUsername == proposta.usernameCreatore) {
            // Aggiorna la richiesta cambiando il campo stato
            richiesta = await Richiesta.findByIdAndUpdate(id, stato, { new: true });
            // Se accetto la richiesta aggiungo il richiedente ai partecipanti
            if (stato.stato == "accettata") {
                proposta.partecipanti.push(richiesta.usernameRichiedente);
                proposta.numeroPartecipanti = proposta.numeroPartecipanti + 1;
                proposta.save();
            }
            return res.status(200).json({ self: "richeste/" + richiesta._id });
        }
        else {
            return res.status(403).json({ message: "Impossibile modificare una richiesta ad una proposta altrui" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Errore durante la modifica della richiesta", error: error.message });
    }
}*/

async function handleRichiestaById(req, res) {
    try {
        const id = req.params.id;
        const idProposta = req.params.idProposta;
        const proposta = await Proposta.findById(idProposta);
        const loggedUsername = req.utenteLoggato.loggedUsername; // Username dell'utente loggato
        const stato = req.body;
        var richiesta = await Richiesta.findById(id);
        const errors = [];

        if (!proposta) {
            return res.status(404).json({ message: "Proposta non trovata" });
        }

        if (!richiesta) {
            return res.status(404).json({ message: "Richiesta non trovata" });
        }

        if (!validateStato(stato.stato))
            errors.push({ field: "stato", message: "Stato non valido - stati accettati['accettata','rifiutata']" });

        // Gestione degli errori
        if (errors.length > 0)
            return res.status(400).json({ message: "error", errors });

        // Modifico la richiesta solo se sono il creatore della proposta
        if (loggedUsername == proposta.usernameCreatore) {
            // Aggiorna la richiesta cambiando il campo stato
            richiesta = await Richiesta.findByIdAndUpdate(id, stato, { new: true });
            // Se accetto la richiesta aggiungo il richiedente ai partecipanti
            if (stato.stato == "accettata") {
                proposta.partecipanti.push(richiesta.usernameRichiedente);
                proposta.numeroPartecipanti = proposta.numeroPartecipanti + 1;
                proposta.save();
            }
            const propostaUrl = `${HOST_PROPOSTE}${proposta._id}`;
            // Creo una notifica per avvisare il richiedente dell'avvenuta processazione della richiesta
            await Notifica.create({
                sorgente: 'System',
                username: richiesta.usernameRichiedente,
                messaggio: `La tua richiesta per partecipare alla proposta ${proposta.titolo} è stata ${stato.stato}`,
                link: propostaUrl,
                tipo: tipoNotificaEnum.PROPOSTA
            });

            return res.status(200).json({ self: "richeste/" + richiesta._id });
        }
        else {
            return res.status(403).json({ message: "Impossibile modificare una richiesta ad una proposta altrui" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Errore durante la modifica della richiesta", error: error.message });
    }
}

// Esporta handlers
export {
    getRichieste,
    getRichiestaById,
    postRichiesta,
    handleRichiestaById
};