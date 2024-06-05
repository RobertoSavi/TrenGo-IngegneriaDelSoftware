import Notifica from "../models/notificaModel.mjs"
import Utente from "../models/utenteModel.mjs";

/**
 * Crea una nuova notifica.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function postNotifica(req, res) {
  try {
    const { sorgente, username, messaggio } = req.body;

    // Validazione sorgente
    if (sorgente !== 'System') {
      const sorgenteValido = await Utente.findOne({ username: sorgente });
      if (!sorgenteValido) {
        return res.status(400).json({ message: `${sorgente} non è un username valido o "System"`, error: "Errore di validazione" });
      }
    }

    // Validazione username
    const usernameValido = await Utente.findOne({ username });
    if (!usernameValido) {
      return res.status(400).json({ message: `${username} non è un username valido`, error: "Errore di validazione" });
    }

    // Crea una nuova notifica
    const notifica = Notifica.create({ sorgente, username, messaggio });

    // Restituisce la risposta con lo stato 201 e l'ID della nuova notifica
    return res.status(201).json({ self: "notifiche/" + notifica._id });
  } catch (error) {
    // Gestisce l'errore e restituisce la risposta con lo stato 500
    return res.status(500).json({ message: "Errore durante la creazione della notifica", error: error.message });
  }
}

/**
 * Aggiorna lo stato di una notifica specifica tramite il suo ID.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function setAsReadById(req, res) {
  try {
    const { id } = req.params;

    // Aggiorna lo stato della notifica con il nuovo valore
    const notifica = await Notifica.findByIdAndUpdate(id, { stato: 'Vista' }, { new: true });

    if (!notifica) return res.status(404).json({ message: 'Notifica non trovata' });

    // Restituisce la risposta con lo stato 200 e l'ID della notifica aggiornata
    return res.status(200).json({ self: "notifiche/" + notifica._id });
  } catch (error) {
    // Gestisce l'errore e restituisce la risposta con lo stato 500
    res.status(500).json({ message: "Errore nell'aggiornamento dello stato della notifica", error: error.message });
  }
}

/**
 * Elimina una notifica specifica per ID.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function deleteNotificaById(req, res) {
  try {
    const { id } = req.params;

    // Elimina la notifica specificata
    const notifica = await Notifica.findByIdAndDelete(id);

    if (!notifica) {
      return res.status(404).json({ message: "Notifica non trovata" });
    }

    // Restituisce la risposta con lo stato 200 se l'eliminazione ha successo
    return res.status(200).json({ message: "Notifica eliminata con successo" });
  } catch (error) {
    // Gestisce l'errore e restituisce la risposta con lo stato 500
    return res.status(500).json({ message: "Errore nell'eliminazione della notifica", error: error.message });
  }
}

/**
 * Ottiene tutte le notifiche per un utente specifico.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function getNotificheByUsername(req, res) {
  try {
    const { username } = req.params;
    const { from } = req.query;

    // Controlla se l'utente esiste
    const utente = await Utente.findOne({ username });
    if (!utente) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    // Filtra le notifiche per sorgente se specificato
    const filter = { username };
    if (from) {
      filter.sorgente = from;
    }

    // Recupera tutte le notifiche per l'utente specificato
    const notifiche = await Notifica.find(filter);

    // Restituisce la risposta con lo stato 200 e le notifiche trovate
    res.status(200).json(notifiche);
  } catch (error) {
    // Gestisce l'errore e restituisce la risposta con lo stato 500
    res.status(500).json({ message: "Errore durante il recupero delle notifiche", error: error.message });
  }
}

/**
 * Imposta tutte le notifiche come lette per un utente specifico.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function setAllASReadByUsername(req, res) {
  try {
    const { username } = req.params;
    const { from } = req.query;

    // Controlla se l'utente esiste
    const utente = await Utente.findOne({ username });
    if (!utente) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    // Filtra le notifiche per sorgente se specificato
    const filter = { username, stato: 'Non vista' };
    if (from) {
      filter.sorgente = from;
    }

    // Imposta lo stato 'Vista' a tutte le notifiche non lette per l'utente specificato
    await Notifica.updateMany(filter, { stato: 'Vista' }, { new: true });

    // Restituisce la risposta con lo stato 200
    res.status(200).json({ message: 'Tutte le notifiche sono state impostate come lette' });
  } catch (error) {
    // Gestisce l'errore e restituisce la risposta con lo stato 500
    res.status(500).json({ message: "Errore nell'aggiornamento dello stato delle notifiche", error: error.message });
  }
}

/**
 * Elimina tutte le notifiche per un utente specifico.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function deleteNotificheByUsername(req, res) {
  try {
    const { username } = req.params;
    const { from } = req.query;

    // Controlla se l'utente esiste
    const utente = await Utente.findOne({ username });
    if (!utente) {
      return res.status(404).json({ message: "Utente non trovato" });
    }

    // Filtra le notifiche per sorgente se specificato
    const filter = { username };
    if (from) {
      filter.sorgente = from;
    }

    // Elimina tutte le notifiche per l'utente specificato
    await Notifica.deleteMany(filter);

    // Restituisce la risposta con lo stato 200
    res.status(200).json({ message: 'Tutte le notifiche per l\'utente sono state eliminate' });
  } catch (error) {
    // Gestisce l'errore e restituisce la risposta con lo stato 500
    res.status(500).json({ message: "Errore nell'eliminazione delle notifiche", error: error.message });
  }
}

export {
  postNotifica,
  setAsReadById,
  deleteNotificaById,
  getNotificheByUsername,
  setAllASReadByUsername,
  deleteNotificheByUsername
};