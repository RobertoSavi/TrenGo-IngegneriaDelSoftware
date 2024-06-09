import Chat from "../models/chatModel.mjs"
import Messaggio from "../models/messaggioModel.mjs"
import Proposta from "../models/propostaModel.mjs"
import Notifica from "../models/notificaModel.mjs"
import { tipoNotificaEnum } from "../models/enums.mjs";
import validateContenuto from "../validators/chatsValidators.mjs";
import moment from 'moment-timezone'

const HOST_PROPOSTE = 'proposte/';

/**
 * Crea una nuova notifica.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function getChatsByUsername(req, res) {
	try {
		const loggedUsername = req.utenteLoggato.loggedUsername;

		const chats = await Chat.find({partecipanti: loggedUsername});

		// Controllo se l'utente partecipa a qualche chat
		if (!chats) {
			return res.status(404).json({ message: "Nessuna chat trovata." });
		}

		return res.status(200).json({ chats });
	} catch (error) {
		// Gestisce l'errore e restituisce la risposta con lo stato 500
		return res.status(500).json({ message: "Errore durante il recupero della chat", error: error.message });
	}
}

/**
 * Crea una nuova notifica.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function getChatById(req, res) {
	try {
		const { idChat } = req.params;
		const loggedUsername = req.utenteLoggato.loggedUsername;

		const chat = await Chat.findById(idChat);

		// Controllo che l'id passato sia collegato ad una chat
		if (!chat) {
			return res.status(404).json({ message: "Nessuna chat trovata." });
		}

		// Controllo se l'username loggato fa parte della chat
		if (!chat.partecipanti.includes(loggedUsername)) {

			return res.status(400).json({ message: "Impossibile accedere ad una chat di cui non si fa parte." });
		}

		return res.status(200).json({ chat });
	} catch (error) {
		// Gestisce l'errore e restituisce la risposta con lo stato 500
		return res.status(500).json({ message: "Errore durante il recupero della chat", error: error.message });
	}
}

/**
 * Crea una nuova notifica.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function getMessaggi(req, res) {
	try {
		const { idChat } = req.params;
		const loggedUsername = req.utenteLoggato.loggedUsername;

		const chat = await Chat.findById(idChat);

		let messaggi = [];

		// Controllo che l'id passato sia collegato ad una chat
		if (!chat) {
			return res.status(404).json({ message: "Nessuna chat trovata." });
		}

		// Controllo se l'username loggato fa parte della chat
		if (!chat.partecipanti.includes(loggedUsername)) {

			return res.status(400).json({ message: "Impossibile accedere ad una chat di cui non si fa parte." });
		}

		for (var index in chat.messaggi) {
			messaggi.push(await Messaggio.findById(chat.messaggi[index]))
		}
		
		return res.status(200).json({ messaggi });
	} catch (error) {
		// Gestisce l'errore e restituisce la risposta con lo stato 500
		return res.status(500).json({ message: "Errore durante il recupero dei messaggi", error: error.message });
	}
}

/**
 * Crea una nuova notifica.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function getMessaggioById(req, res) {
	try {
		const { idChat, idMessaggio } = req.params;
		const loggedUsername = req.utenteLoggato.loggedUsername;

		const chat = await Chat.findById(idChat);
		let messaggio = await Messaggio.findById(idMessaggio);

		// Controllo che l'id passato sia collegato ad una chat
		if (!chat) {
			return res.status(404).json({ message: "Nessuna chat trovata." });
		}

		// Controllo che l'id passato sia collegato ad un messaggio
		if (!messaggio) {
			return res.status(404).json({ message: "Nessun messaggio trovato." });
		}

		// Controllo se l'username loggato fa parte della chat
		if (!chat.partecipanti.includes(loggedUsername)) {
			return res.status(400).json({ message: "Impossibile accedere ad una chat di cui non si fa parte." });
		}

		return res.status(200).json({ messaggio });
	} catch (error) {
		// Gestisce l'errore e restituisce la risposta con lo stato 500
		return res.status(500).json({ message: "Errore durante il recupero del messaggio", error: error.message });
	}
}

/**
 * Crea una nuova notifica.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function postMessaggio(req, res) {
	try {
		const { idChat } = req.params;
		const { contenuto } = req.body;
		const loggedUsername = req.utenteLoggato.loggedUsername;

		const chat = await Chat.findById(idChat);

		// Controllo che l'id passato sia collegato ad una chat
		if (!chat) {
			return res.status(404).json({ message: "Nessuna chat trovata." });
		}

		// Controllo se l'username loggato fa parte della chat
		if (!chat.partecipanti.includes(loggedUsername)) {
			return res.status(400).json({ message: "Impossibile accedere ad una chat di cui non si fa parte." });
		}

		if(!validateContenuto(contenuto))
		{
			return res.status(401).json({ message: "Impossibile inviare un messaggio senza contenuto." });
		}

		const proposta= await Proposta.findById(chat.idProposta);
		const propostaUrl = `${HOST_PROPOSTE}${chat.idProposta}`;
		const now=moment(new Date()).tz('Europe/Rome').format("DD-MM-YYYY HH:mm");
		const messaggio = await Messaggio.create({ contenuto: contenuto, senderUsername: loggedUsername, idChat: idChat, data: now });

		let messaggi = chat.messaggi;
		messaggi.push(messaggio._id);
		await Chat.findByIdAndUpdate(idChat, { messaggi: messaggi });

		chat.partecipanti.forEach(async partecipante => {
			// Crea una notifica per il partecipante
			if (partecipante != loggedUsername)
			{
				await Notifica.create({
					sorgente: loggedUsername,
					username: partecipante,
					messaggio: `L'utente ${loggedUsername} ha mandato un messaggio nella proposta: ${proposta.titolo}`,
					link: propostaUrl,
					tipo: tipoNotificaEnum.MESSAGGIO
				});
			}
		});

		return res.status(201).json({ self: "messaggi/" + messaggio._id });
	} catch (error) {
		// Gestisce l'errore e restituisce la risposta con lo stato 500
		return res.status(500).json({ message: "Errore durante la creazione del messaggio", error: error.message });
	}
}

export {
	getChatsByUsername,
	getChatById,
	getMessaggi,
	getMessaggioById,
	postMessaggio
};