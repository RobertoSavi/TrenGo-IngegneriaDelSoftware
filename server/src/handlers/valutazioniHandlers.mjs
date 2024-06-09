import Utente from "../models/utenteModel.mjs";
import Proposta from "../models/propostaModel.mjs";
import Valutazione from "../models/valutazioneModel.mjs";

/**
 * Permette all'utente loggato di valutare tutti i partecipanti ad una proposta tramite idProposta.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function valutaPartecipantiByIdProposta(req, res) {
    try {
        const idProposta = req.params.idProposta;
        const proposta = await Proposta.findById(idProposta);
        const loggedUsername = req.utenteLoggato ? req.utenteLoggato.loggedUsername : null; // Username dell'utente loggato (se presente)
        const valutazione = req.body.valutazione;

        // Se l'utente non è loggato
        if (!loggedUsername) {
            return res.status(401).send({
                success: false,
                message: 'Nessun token fornito.'
            });
        }
        else {
            if (!proposta) {
                return res.status(404).json({ message: "Proposta non trovata" });
            }
            let partecipanti = [];
            if (loggedUsername == proposta.usernameCreatore) {
                for (const partecipante of proposta.partecipanti) {
                    const valutazioneEsistente = await Valutazione.findOne({ idProposta: idProposta, usernameValutato: partecipante, usernameValutatore: loggedUsername });
                    if (valutazioneEsistente) {
                        continue;
                    }
                    partecipanti.push(partecipante);
                };
            }
            else {
                for (const partecipante of proposta.partecipanti.filter(partecipante => partecipante != loggedUsername)) {
                    const valutazioneEsistente = await Valutazione.findOne({ idProposta: idProposta, usernameValutato: partecipante, usernameValutatore: loggedUsername });
                    if (valutazioneEsistente) {
                        continue;
                    }
                    partecipanti.push(partecipante);
                };
                const valutazioneEsistente = await Valutazione.findOne({ idProposta: idProposta, usernameValutato: proposta.usernameCreatore, usernameValutatore: loggedUsername });
                if (!valutazioneEsistente) {
                    partecipanti.push(proposta.usernameCreatore);
                }
            }

            if (partecipanti.length == 0) {
                return res.status(400).json({ message: "Tutti i partecipanti sono già stati valutati" });
            }
            for (let i = 0; i < partecipanti.length; i++) {
                const utenteValutato = await Utente.findOne({ username: partecipanti[i] });
                await Valutazione.create({
                    idProposta: idProposta,
                    usernameValutato: utenteValutato.username,
                    usernameValutatore: loggedUsername,
                    valutazione: valutazione
                });
                utenteValutato.karma += valutazione;
                await utenteValutato.save();
            }

            return res.status(200).json({ message: "Valutazioni effettuate con successo" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Errore durante la valutazione dei partecipanti", error: error.message });
    }
}

/**
 * Permette all'utente loggato di valutare un partecipante ad una proposta tramite idProposta e username.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function valutaPartecipanteByUsername(req, res) {
    try {
        const idProposta = req.params.idProposta;
        const username = req.params.username;
        const proposta = await Proposta.findById(idProposta);
        const utenteValutato = await Utente.findOne({ username });
        const loggedUsername = req.utenteLoggato ? req.utenteLoggato.loggedUsername : null; // Username dell'utente loggato (se presente)
        const valutazione = req.body.valutazione;

        // Se l'utente non è loggato
        if (!loggedUsername) {
            return res.status(401).send({
                success: false,
                message: 'Nessun token fornito.'
            });
        }
        else {
            if (!proposta) {
                return res.status(404).json({ message: "Proposta non trovata" });
            }

            if (!utenteValutato) {
                return res.status(404).json({ message: "Utente non trovato" });
            }

            if (loggedUsername == utenteValutato.username) {
                return res.status(400).json({ message: "Impossibile valutare se stessi" });
            }

            const valutazioneEsistente = await Valutazione.findOne({ idProposta: idProposta, usernameValutato: username, usernameValutatore: loggedUsername });
            if (valutazioneEsistente) {
                return res.status(400).json({ message: "Valutazione già effettuata" });
            }
            else {
                await Valutazione.create({
                    idProposta: idProposta,
                    usernameValutato: username,
                    usernameValutatore: loggedUsername,
                    valutazione: valutazione
                });
                utenteValutato.karma += valutazione;
                await utenteValutato.save();
            }

            return res.status(200).json({ message: "Valutazione effettuata con successo" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Errore durante la valutazione del partecipante", error: error.message });
    }
}

export {
    valutaPartecipantiByIdProposta,
    valutaPartecipanteByUsername
}