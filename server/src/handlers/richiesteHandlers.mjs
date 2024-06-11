import Richiesta from "../models/richiestaModel.mjs"
import Proposta from "../models/propostaModel.mjs"
import Notifica from "../models/notificaModel.mjs"
import Utente from "../models/utenteModel.mjs"
import Chat from "../models/chatModel.mjs"
import { tipoNotificaEnum } from "../models/enums.mjs";
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
        console.log("Richieste");
        const idProposta = req.params.idProposta;
        const proposta = await Proposta.findById(idProposta);
        const loggedUsername = req.utenteLoggato ? req.utenteLoggato.loggedUsername : null; // Username dell'utente loggato
        const richieste = await Richiesta.find({ idProposta, stato: "pending" });
        const grandiOrganizzatori = await Utente.find({ tipoUtente: "grandeOrganizzatore" });

        // Mappa i username dei grandi organizzatori
        const grandiOrganizzatoriUsernames = grandiOrganizzatori.map(u => u.username);
        // Controlla se proposta.usernameCreatore è presente in grandiOrganizzatoriUsernames
        const isGrandeOrganizzatore = grandiOrganizzatoriUsernames.includes(proposta.usernameCreatore);
        // Se l'utente non è loggato
        if (!loggedUsername) {
            if (isGrandeOrganizzatore) {
                return res.status(200).send({ success: true, message: 'Grande organizzatore' });
            } else {
                return res.status(401).send({
                    success: false,
                    message: 'Nessun token fornito.'
                });
            }
        }
        // Se l'utente è loggato
        else if (loggedUsername) {
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
                const richiesta = await Richiesta.find({ idProposta, usernameRichiedente: loggedUsername, stato: "pending" });

                if (!richiesta) {
                    return res.status(403).json({ message: "Impossibile ottenere le richieste alle proposte altrui se non si ha una richiesta propria" });
                }

                return res.status(201).json({ richiesta });
            }
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
        const loggedUsername = req.utenteLoggato ? req.utenteLoggato.loggedUsername : null; // Username dell'utente loggato
        const richiesta = await Richiesta.findById(id);

        // Se l'utente non è loggato
        if (!loggedUsername) {
            return res.status(401).send({
                success: false,
                message: 'Nessun token fornito.'
            });
        }
        // Se l'utente è loggato
        else {
            if (!proposta) {
                return res.status(404).json({ message: "Proposta non trovata" });
            }

            if (!richiesta) {
                return res.status(404).json({ message: "Richiesta non trovata" });
            }

            // Restituisco la richiesta alla proposta solo se sono il creatore della proposta
            if (loggedUsername == proposta.usernameCreatore.toString() || loggedUsername == richiesta.usernameRichiedente.toString()) {
                return res.status(200).json({ richiesta });
            }
            else {
                return res.status(403).json({ message: "Impossibile ottenere una richiesta ad una proposta altrui" });
            }
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
async function postRichiesta(req, res) {
    try {
        const idProposta = req.params.idProposta;
        const { usernameRichiedente } = req.body;
        const loggedUsername = req.utenteLoggato ? req.utenteLoggato.loggedUsername : null; // Username dell'utente loggato

        // Se l'utente non è loggato
        if (!loggedUsername) {
            return res.status(401).send({
                success: false,
                message: 'Nessun token fornito.'
            });
        }
        // Se l'utente è loggato
        else {
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
                    username: proposta.usernameCreatore,
                    messaggio: `L'utente ${loggedUsername} ha richiesto di partecipare alla proposta: ${proposta.titolo}`,
                    link: propostaUrl,
                    tipo: tipoNotificaEnum.PROPOSTA
                });
            }
            else {
                return res.status(403).json({ message: "Impossibile richiedere di partecipare alle proprie proposte" });
            }
            return res.status(201).json({ self: "richieste/" + richiesta._id });
        }
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
async function handleRichiestaById(req, res) {
    try {
        const id = req.params.id;
        const idProposta = req.params.idProposta;
        const proposta = await Proposta.findById(idProposta);
        const loggedUsername = req.utenteLoggato ? req.utenteLoggato.loggedUsername : null; // Username dell'utente loggato
        const stato = req.body;
        var richiesta = await Richiesta.findById(id);
        var chat = await Chat.findById(proposta.idChat);
        const errors = [];

        // Se l'utente non è loggato
        if (!loggedUsername) {
            return res.status(401).send({
                success: false,
                message: 'Nessun token fornito.'
            });
        }
        // Se l'utente è loggato
        else {
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
                    chat.partecipanti.push(richiesta.usernameRichiedente);
                    chat.save();
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
        }
    } catch (error) {
        return res.status(500).json({ message: "Errore durante la modifica della richiesta", error: error.message });
    }
}

/**
 * Elimina una richiesta pending dal database
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function deleteRichiestaById(req, res) {
    try {
        const { id } = req.params;
        const loggedUsername = req.utenteLoggato ? req.utenteLoggato.loggedUsername : null; // ID dell'utente loggato

        // Se l'utente non è loggato
        if (!loggedUsername) {
            return res.status(401).send({
                success: false,
                message: 'Nessun token fornito.'
            });
        }
        // Se l'utente è loggato
        else {
            // Trovo la proposta da modificare
            var richiesta = await Richiesta.findById(id);

            if (!richiesta) {
                return res.status(404).json({ message: "Richiesta non trovata" });
            }

            // Permetto la modifica dei dati utente solo se il chiamante dell'API è il richiedente
            if (richiesta.usernameRichiedente == loggedUsername) {
                // Trova e elimina la richiesta dal database
                // Elimino la richiesta
                await Richiesta.findByIdAndDelete(id);
            }
            else {
                return res.status(403).json({ message: "Impossibile eliminare richieste altrui" });
            }
            return res.status(204).json({ message: "Richiesta eliminata con successo" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Errore durante l'eliminazione della richiesta", error: error.message });
    }
}

// Esporta handlers
export {
    getRichieste,
    getRichiestaById,
    postRichiesta,
    handleRichiestaById,
    deleteRichiestaById
};