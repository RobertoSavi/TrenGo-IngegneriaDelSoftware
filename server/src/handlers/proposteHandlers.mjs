import Proposta from "../models/propostaModel.mjs"
import Utente from "../models/utenteModel.mjs"
import Richiesta from "../models/richiestaModel.mjs"
import Valutazione from "../models/valutazioneModel.mjs"
import Notifica from "../models/notificaModel.mjs"
import Chat from "../models/chatModel.mjs"
import Messaggio from "../models/messaggioModel.mjs"
import { tipoNotificaEnum } from "../models/enums.mjs";
import validators from "../validators/proposteValidators.mjs";
import mongoose from "mongoose";
//import {ObjectId} from "mongodb";

const HOST_PROPOSTE = 'proposte/';

/**
 * Ottiene le proposte dal database, con comportamento variabile basato sui parametri di query.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function getProposte(req, res) {
	try {
		const loggedUsername = req.utenteLoggato ? req.utenteLoggato.loggedUsername : null; // Username dell'utente loggato
		const query = {};

		// Controlla i parametri di query
		const { mie, iscritto, terminate } = req.query;

		// Se l'utente è loggato
		if (loggedUsername) {
			if (mie === 'true') {
				// Aggiungi la condizione per le proposte pubblicate dall'utente loggato
				query.usernameCreatore = loggedUsername;
			}
			if (iscritto === 'true') {
				// Aggiungi la condizione per le proposte alle quali l'utente loggato partecipa
				query.partecipanti = loggedUsername;
			}
			if (terminate === 'true') {
				const now = new Date();
				const yesterday = new Date(now.setDate(now.getDate() - 1));

				// Aggiungi condizione per le proposte completate alle quali l'utente loggato ha partecipato o è il creatore
				query.$or = [
					{ data: { $lte: yesterday }, partecipanti: loggedUsername },
					{ data: { $lte: yesterday }, usernameCreatore: loggedUsername }
				];
			}
			// Ottiene le proposte in base ai criteri di ricerca combinati
			const proposte = await Proposta.find(query);

			if (!proposte) {
				console.log("Nessuna proposta disponibile.");
				return res.status(404).json({ message: "Nessuna proposta disponibile." });
			}

			return res.status(200).json({ proposte });
		}
		// Se l'utente non è loggato
		else {
			const grandiOrganizzatori = await Utente.find({ tipoUtente: "grandeOrganizzatore" });
			const proposte = await Proposta.find({ usernameCreatore: { $in: grandiOrganizzatori.map(u => u.username) } });
			if (!proposte) {
				return res.status(400).json({ message: "Nessuna proposta disponibile." });
			}
			return res.status(200).json({ proposte });
		}
	} catch (error) {
		return res.status(500).json({ message: "Errore durante il recupero delle proposte", error: error.message });
	}
}

/**
 * Ottiene una proposte dal database.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function getPropostaById(req, res) {
	try {
		const { id } = req.params;
		const { valutazioni } = req.query;
		const proposta = await Proposta.findById(id);
		const loggedUsername = req.utenteLoggato ? req.utenteLoggato.loggedUsername : null; // Username dell'utente loggato

		if (!proposta) {
			return res.status(400).json({ message: "Proposta non trovata" });
		}

		// Se l'utente è loggato
		if (loggedUsername) {
			if (valutazioni === 'true' && proposta.valutabile === true) {
				const propostaCopy = JSON.parse(JSON.stringify(proposta)); // Crea una copia dell'oggetto proposta
				let utentiValutabili = 0;
				if (loggedUsername === proposta.usernameCreatore) {
					for (let i = 0; i < propostaCopy.partecipanti.length; i++) {
						const valutazioneEsistente = await Valutazione.findOne({ idProposta: id, usernameValutato: propostaCopy.partecipanti[i], usernameValutatore: loggedUsername });
						if (!valutazioneEsistente) {
							utentiValutabili++;
						}
						propostaCopy.partecipanti[i] = [propostaCopy.partecipanti[i], !!valutazioneEsistente];
						propostaCopy.utentiValutabili = utentiValutabili;
						return res.status(200).json({ proposta: propostaCopy });
					}
				} else if(proposta.partecipanti.includes(loggedUsername)){
					propostaCopy.partecipanti = propostaCopy.partecipanti.filter(partecipante => partecipante !== loggedUsername);
					for (let i = 0; i < propostaCopy.partecipanti.length; i++) {
						const valutazioneEsistente = await Valutazione.findOne({ idProposta: id, usernameValutato: propostaCopy.partecipanti[i], usernameValutatore: loggedUsername });
						if (!valutazioneEsistente) {
							utentiValutabili++;
						}
						propostaCopy.partecipanti[i] = [propostaCopy.partecipanti[i], !!valutazioneEsistente];
					}
					const valutazioneEsistente = await Valutazione.findOne({ idProposta: id, usernameValutato: propostaCopy.usernameCreatore, usernameValutatore: loggedUsername });
					if (!valutazioneEsistente) {
						utentiValutabili++;
					}
					propostaCopy.partecipanti.push([propostaCopy.usernameCreatore, !!valutazioneEsistente]);
					propostaCopy.utentiValutabili = utentiValutabili;
					return res.status(200).json({ proposta: propostaCopy });
				}
			} else {
				return res.status(200).json({ proposta });
			}
		}
		// Se l'utente non è loggato
		else {
			const utenteCreatore = await Utente.findOne({ username: proposta.usernameCreatore });
			if (utenteCreatore.tipoUtente === 'grandeOrganizzatore') {
				return res.status(200).json({ proposta });
			} else {
				return res.status(401).json({ message: "Non sei autorizzato a visualizzare questa proposta" });
			}
		}
	} catch (error) {
		return res.status(500).json({ message: "Errore durante il recupero della proposta", error: error.message });
	}
}

/**
 * Ottiene le proposte dal database in base a query specifiche.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function ricercaProposte(req, res) {
	try {
		const loggedUsername = req.utenteLoggato ? req.utenteLoggato.loggedUsername : null; // Username dell'utente loggato
		const query = {};

		// Controlla i parametri del body
		const { usernameCreatore, nomeLuogo, maxPartecipanti, minPartecipanti } = req.query;

		if (usernameCreatore) {
			query.usernameCreatore = { $regex: new RegExp(usernameCreatore, 'i') };
		}

		if (nomeLuogo) {
			query.nomeLuogo = { $regex: new RegExp(nomeLuogo, 'i') };
		}

		if (maxPartecipanti && minPartecipanti) {
			query.numeroPartecipantiDesiderato = { $lte: maxPartecipanti, $gte: minPartecipanti };
		}
		else if (maxPartecipanti) {
			query.numeroPartecipantiDesiderato = { $lte: maxPartecipanti };
		}
		else if (minPartecipanti) {
			query.numeroPartecipantiDesiderato = { $lte: minPartecipanti };
		}

		// Se l'utente è loggato restituisco le proposte cercate
		if (loggedUsername) {
			const proposte = await Proposta.find(query);
			if (!proposte) {
				return res.status(404).json({ message: "Nessuna proposta disponibile." });
			}

			return res.status(200).json({ proposte });
		}
		// Se l'utente non è loggato restituisco solo le proposte cercate pubblicate da grandi organizzatori
		else {
			const grandiOrganizzatori = await Utente.find({ tipoUtente: "grandeOrganizzatore" });
			query.usernameCreatore = { $in: grandiOrganizzatori.map(u => u.username) };
			const proposte = await Proposta.find(query);

			if (!proposte) {
				return res.status(404).json({ message: "Nessuna proposta disponibile." });
			}

			return res.status(200).json({ proposte });
		}

	} catch (error) {
		return res.status(500).json({ message: "Errore durante il recupero delle proposte", error: error.message });
	}
}

/**
 * Inserisce una proposta nel database.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function postProposta(req, res) {
	const { titolo, categorie, nomeLuogo, coordinate, descrizione, numeroPartecipantiDesiderato, data } = req.body;
	const loggedUsername = req.utenteLoggato ? req.utenteLoggato.loggedUsername : null;
	const errors = [];
	const utenteCreatore = await Utente.findOne({ username: loggedUsername });

	// Controlla se l'utente è loggato
	if (!loggedUsername) {
		return res.status(401).send({
			success: false,
			message: 'Nessun token fornito.'
		});
	}
	else {
		// Validazione delle categorie
		if (!validators.categorieInEnum(categorie))
			errors.push({ field: "categorie", message: "Categorie non valide" });

		// Validazione del titolo
		if (!validators.validateTitolo(titolo))
			errors.push({ field: "titolo", message: "Titolo troppo lungo o troppo corto" });

		// Validazione delle coordinate	
		if (!validators.validateCoordinate(coordinate))
			errors.push({ field: "titolo", message: "Latitudine o longitudine non valide" });

		// Validazione della descrizione
		if (!validators.validateDescrizione(descrizione))
			errors.push({ field: "descrizione", message: "Descrizione troppo lunga" });

		// Gestione degli errori
		if (errors.length > 0)
			return res.status(400).json({ message: "error", errors });

		try {
			// Creazione della proposta
			const proposta = await Proposta.create({ usernameCreatore: loggedUsername, titolo, categorie, nomeLuogo, coordinate, descrizione, numeroPartecipantiDesiderato, data });
			const propostaUrl = `${HOST_PROPOSTE}${proposta._id}`;
			const chat = await Chat.create({ partecipanti: [loggedUsername], idProposta: proposta._id, messaggi: [] })
			await Proposta.findByIdAndUpdate(proposta._id, { idChat: chat._id });
			// Creo una notifica per ogni utente che segue l'utente creatore della proposta
			utenteCreatore.followers.forEach(async follower => {
				// Creo una notifica per il follower
				const notifica = await Notifica.create({
					sorgente: 'System',
					username: follower,
					messaggio: `L'utente ${proposta.usernameCreatore} ha pubblicato una nuova proposta: ${proposta.titolo}`,
					link: propostaUrl,
					tipo: tipoNotificaEnum.PROPOSTA
				});
			});
			return res.status(201).json({ self: "proposte/" + proposta._id });

		} catch (error) {
			// Gestione dell'errore durante la creazione della proposta
			return res.status(500).json({ message: "Errore durante la creazione della proposta", error: error.message });
		}
	}
}

/**
 * Rimuove un partecipante dalla proposta.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function annullaPartecipazioneById(req, res) {
	const loggedUsername = req.utenteLoggato ? req.utenteLoggato.loggedUsername : null; // Username dell'utente loggato
	const idProposta = req.params.id;
	const proposta = await Proposta.findById(idProposta);

	let partecipanti = proposta.partecipanti;

	// Se l'utente non è loggato
	if (!loggedUsername) {
		return res.status(401).send({
			success: false,
			message: 'Nessun token fornito.'
		});
	}
	// Se l'utente è loggato
	else {
		try {

			if (!partecipanti.includes(loggedUsername)) {
				return res.status(401).json({ message: "Non sei un partecipante di questa proposta" });
			}

			partecipanti = partecipanti.filter(partecipanteUsername => partecipanteUsername !== loggedUsername);

			await Proposta.findByIdAndUpdate(idProposta, { partecipanti: partecipanti, numeroPartecipanti: --proposta.numeroPartecipanti }, { new: true });

			const chat = await Chat.findById(proposta.idChat);
			chat.partecipanti = chat.partecipanti.filter(partecipanteUsername => partecipanteUsername !== loggedUsername);
			chat.save();

			return res.status(201).json({ self: "proposte/" + idProposta });

		} catch (error) {
			// Gestione dell'errore durante la modifica della proposta
			return res.status(500).json({ message: "Errore durante la modifica della proposta", error: error.message });
		}
	}
}

/**
 * Modifica una proposta nel database
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function modifyPropostaById(req, res) {
	try {
		const { id } = req.params;
		const updates = req.body;
		const loggedUsername = req.utenteLoggato ? req.utenteLoggato.loggedUsername : null; // ID dell'utente loggato

		// Se l'utente non è loggato
		if (!loggedUsername) {
			return res.status(401).send({
				success: false,
				message: 'Nessun token fornito.'
			});
		}
		else {
			// Trovo la proposta da modificare
			var proposta = await Proposta.findById(id);

			if (!proposta) {
				return res.status(404).json({ message: "Proposta non trovata" });
			}

			// Permetto la modifica dei dati utente solo se il chiamante dell'API è il creatore della proposta
			if (proposta.usernameCreatore == loggedUsername) {
				// Aggiorna il documento proposta con tutti i campi forniti nel corpo della richiesta
				proposta = await Proposta.findByIdAndUpdate(id, updates, { new: true });
				const propostaUrl = `${HOST_PROPOSTE}${proposta._id}`;
				// Creo una notifica per ogni utente partecipante alla proposta
				proposta.partecipanti.forEach(async partecipante => {
					// Crea una notifica per il partecipante
					await Notifica.create({
						sorgente: 'System',
						username: partecipante,
						messaggio: `L'utente ${proposta.usernameCreatore} ha modificato la proposta: ${proposta.titolo}`,
						link: propostaUrl,
						tipo: tipoNotificaEnum.PROPOSTA
					});
				});
			}
			else {
				return res.status(403).json({ message: "Impossibile modificare proposte altrui" });
			}

			return res.status(200).json({ proposta });
		}
	} catch (error) {
		return res.status(500).json({ message: "Errore durante la modifica della proposta", error: error.message });
	}
}

/**
 * Elimina una proposta dal database
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function deletePropostaById(req, res) {
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
			var proposta = await Proposta.findById(id);

			if (!proposta) {
				return res.status(404).json({ message: "Proposta non trovata" });
			}

			// Permetto la modifica dei dati utente solo se il chiamante dell'API è il creatore della proposta
			if (proposta.usernameCreatore == loggedUsername) {
				// Creo una notifica per ogni utente partecipante alla proposta
				const propostaUrl = `${HOST_PROPOSTE}${proposta._id}`;
				proposta.partecipanti.forEach(async partecipante => {
					// Creo una notifica per il partecipante
					await Notifica.create({
						sorgente: 'System',
						username: partecipante,
						messaggio: `L'utente ${proposta.usernameCreatore} ha eliminato la proposta: ${proposta.titolo}`,
						link: propostaUrl,
						tipo: tipoNotificaEnum.PROPOSTA
					});
				});
				// Trova e elimina la proposta dal database
				// Elimino la proposta
				await Proposta.findByIdAndDelete(id);
				// Elimino tutte le richieste relative alla proposta
				await Richiesta.deleteMany({ idProposta: id });
				// Elimino tutte le valutazioni relative alla proposta
				await Valutazione.deleteMany({ idProposta: id });
				// Elimino tutte la chat relativa alla proposta
				const chat = await Chat.findByIdAndDelete(proposta.idChat);
				// Elimino tutti i messaggi relativi alla chat relative alla proposta
				await Messaggio.deleteMany({ idChat: chat._id });
			}
			else {
				return res.status(403).json({ message: "Impossibile eliminare proposte altrui" });
			}
			return res.status(204).json({ message: "Proposta eliminata con successo" });
		}
	} catch (error) {
		return res.status(500).json({ message: "Errore durante l'eliminazione della proposta", error: error.message });
	}
}

// Esporta handlers
export {
	getProposte,
	getPropostaById,
	ricercaProposte,
	postProposta,
	annullaPartecipazioneById,
	modifyPropostaById,
	deletePropostaById
};