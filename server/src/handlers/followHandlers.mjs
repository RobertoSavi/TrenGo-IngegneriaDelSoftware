import Utente from "../models/utenteModel.mjs";
import Notifica from "../models/notificaModel.mjs"
import { tipoNotificaEnum } from "../models/enums.mjs";

const HOST_UTENTI = 'utenti/';

/**
 * Permette all'utente loggato di seguire un altro utente tramite username.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function follow(req, res) {
    try {
        const { username } = req.params;
        const loggedUsername = req.utenteLoggato ? req.utenteLoggato.loggedUsername : null; // Username dell'utente loggato (se presente)

        // Se l'utente non è loggato
        if (!loggedUsername) {
            return res.status(401).send({
                success: false,
                message: 'Nessun token fornito.'
            });
        }
        // Se l'utente è loggato
        else {
            // Controlla se l'utente esiste
            const utente = await Utente.findOne({ username });
            if (!utente) {
                return res.status(404).json({ message: "Utente non trovato" });
            }

            // Controlla se l'utente loggato sta già seguendo l'utente specificato
            const utenteLoggato = await Utente.findOne({ username: loggedUsername });
            if (utenteLoggato.following.includes(username)) {
                return res.status(400).json({ message: "Stai già seguendo questo utente" });
            }

            // Restituisce la risposta con lo stato 200 se il follow ha successo
            utenteLoggato.following.push(username);
            utenteLoggato.save();
            utente.followers.push(loggedUsername);

            // Creo una notifica per l'utente seguito
            const utenteUrl = `${HOST_UTENTI}username/${loggedUsername}`;
            await Notifica.create({
                sorgente: 'System',
                username: utente.username,
                messaggio: `L'utente ${loggedUsername} ha cominciato a seguirti:`,
                link: utenteUrl,
                tipo: tipoNotificaEnum.UTENTE
            });

            return res.status(200).json({ message: "Stai seguendo l'utente: " + username });
        }
    } catch (error) {
        // Gestisce l'errore e restituisce la risposta con lo stato 500
        return res.status(500).json({ message: "Errore nel seguire l'utente", error: error.message });
    }
}

/**
 * Permette all'utente loggato di smettere di seguire un altro utente tramite username.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function unfollow(req, res) {
    try {
        const { username } = req.params;
        const loggedUsername = req.utenteLoggato ? req.utenteLoggato.loggedUsername : null; // Username dell'utente loggato (se presente)

        // Se l'utente non è loggato
        if (!loggedUsername) {
            return res.status(401).send({
                success: false,
                message: 'Nessun token fornito.'
            });
        }
        // Se l'utente è loggato
        else {
            // Controlla se l'utente esiste
            const utente = await Utente.findOne({ username });
            if (!utente) {
                return res.status(404).json({ message: "Utente non trovato" });
            }

            // Controlla se l'utente loggato sta seguendo l'utente specificato
            const utenteLoggato = await Utente.findOne({ username: loggedUsername });
            if (!utenteLoggato.following.includes(username)) {
                return res.status(400).json({ message: "Non stai seguendo questo utente" });
            }

            // Rimuove l'utente dalla lista dei seguiti
            utenteLoggato.following = utenteLoggato.following.filter(followingUsername => followingUsername !== username);
            await utenteLoggato.save();
            utente.followers = utente.followers.filter(followedUsername => followedUsername !== loggedUsername);
            await utente.save();

            // Restituisce la risposta con lo stato 200 se l'unfollow ha successo
            return res.status(200).json({ message: "Hai smesso di seguire l'utente: " + username });
        }
    } catch (error) {
        // Gestisce l'errore e restituisce la risposta con lo stato 500
        return res.status(500).json({ message: "Errore nello smettere di seguire l'utente", error: error.message });
    }
}

export {
    follow,
    unfollow
}