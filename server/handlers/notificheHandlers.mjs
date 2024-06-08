import Notifica from "../models/notificaModel.mjs"
import Utente from "../models/utenteModel.mjs";
import { tipoInEnum } from "../validators/notificheValidators.mjs";
import { statoNotificaEnum, tipoNotificaEnum } from "../models/enums.mjs";

/**
 * Crea una nuova notifica.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function postNotifica(req, res) {
  try {
    const { sorgente, username, messaggio, link, tipo } = req.body;
    const loggedUsername = req.utenteLoggato ? req.utenteLoggato.loggedUsername : null;
    const errors = [];

    // Se l'utente non è loggato
    if (!loggedUsername) {
      return res.status(401).send({
        success: false,
        message: 'Nessun token fornito.'
      });
    }
    else {
      // Validazione sorgente
      if (sorgente !== 'System') {
        const sorgenteValido = await Utente.findOne({ username: sorgente });
        if (!sorgenteValido) {
          return res.status(400).json({ message: `${sorgente} non è un username valido o "System"`, error: "Errore di validazione" });
        }
      }

      // Controllo se l'utente loggato è diverso dalla sorgente della notifica
      if (loggedUsername !== sorgente) {
        return res.status(403).json({ message: "Impossibile creare notifiche con l'username di altri" });
      }

      // Controllo se l'utente loggato è uguale al destinatario della notifica
      if (loggedUsername === username) {
        return res.status(403).json({ message: "Impossibile creare notifiche per se stessi" });
      }

      // Validazione tipo
      if (!tipoInEnum(tipo))
        errors.push({ field: "tipo", message: "Tipo non valido, i valori accettati sono ['Proposta', 'Chat', 'Utente']" });

      // Gestione degli errori
      if (errors.length > 0)
        return res.status(400).json({ message: "error", errors });

      // Validazione username
      const usernameValido = await Utente.findOne({ username });
      if (!usernameValido) {
        return res.status(400).json({ message: `${username} non è un username valido`, error: "Errore di validazione" });
      }

      // Prepara l'oggetto della nuova notifica
      const datiNotifica = { sorgente, username, messaggio, tipo };

      // Include 'link' se è stato specificato
      if (link) {
        datiNotifica.link = link;
      }

      // Crea una nuova notifica
      const notifica = await Notifica.create(datiNotifica);
      // Restituisce la risposta con lo stato 201 e l'ID della nuova notifica
      return res.status(201).json({ self: "notifiche/" + notifica._id });
    }
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
    const loggedUsername = req.utenteLoggato ? req.utenteLoggato.loggedUsername : null;

    // Se l'utente non è loggato
    if (!loggedUsername) {
      return res.status(401).send({
        success: false,
        message: 'Nessun token fornito.'
      });
    }
    // Se l'utente è loggato
    else {
      // Recupera la notifica specificata
      let notifica = await Notifica.findById(id);

      // Se l'utente loggato è diverso dal destinatario della notifica, restituisce un errore
      if (loggedUsername !== notifica.username) {
        return res.status(403).json({ message: "Non hai i permessi per leggere questa notifica" });
      }

      // Aggiorna lo stato della notifica con il nuovo valore
      notifica = await Notifica.findByIdAndUpdate(id, { stato: statoNotificaEnum.SEEN }, { new: true });
      console.log(notifica);

      if (!notifica) return res.status(404).json({ message: 'Notifica non trovata' });

      // Restituisce la risposta con lo stato 200 e l'ID della notifica aggiornata
      return res.status(200).json({ self: "notifiche/" + notifica._id });
    }
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
    const loggedUsername = req.utenteLoggato ? req.utenteLoggato.loggedUsername : null;

    // Se l'utente non è loggato
    if (!loggedUsername) {
      return res.status(401).send({
        success: false,
        message: 'Nessun token fornito.'
      });
    }
    // Se l'utente è loggato
    else {
      // Recupera la notifica specificata
      let notifica = await Notifica.findById(id);

      // Se l'utente loggato è diverso dal destinatario della notifica, restituisce un errore
      if (loggedUsername !== notifica.username) {
        return res.status(403).json({ message: "Non hai i permessi per eliminare questa notifica" });
      }

      // Elimina la notifica specificata
      notifica = await Notifica.findByIdAndDelete(id);

      if (!notifica) {
        return res.status(404).json({ message: "Notifica non trovata" });
      }

      // Restituisce la risposta con lo stato 200 se l'eliminazione ha successo
      return res.status(200).json({ message: "Notifica eliminata con successo" });
    }
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
    const loggedUsername = req.utenteLoggato ? req.utenteLoggato.loggedUsername : null;

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

      // Controllo se l'utente loggato è diverso dall'utente richiesto
      if (loggedUsername !== username) {
        return res.status(403).json({ message: "Non hai i permessi per visualizzare queste notifiche" });
      }

      // Filtra le notifiche per sorgente se specificato
      const filter = { username };
      if (from) {
        filter.sorgente = from;
      }

      // Recupera tutte le notifiche per l'utente specificato
      const notifiche = await Notifica.find(filter).sort({ stato: 'asc' });

      // Restituisce la risposta con lo stato 200 e le notifiche trovate
      res.status(200).json(notifiche);
    }
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
    const loggedUsername = req.utenteLoggato ? req.utenteLoggato.loggedUsername : null;

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

      // Controllo se l'utente loggato è diverso dall'utente richiesto
      if (loggedUsername !== username) {
        return res.status(403).json({ message: "Non hai i permessi per leggere queste notifiche" });
      }

      // Filtra le notifiche per sorgente se specificato
      const filter = { username, stato: statoNotificaEnum.NOT_SEEN };
      if (from) {
        filter.sorgente = from;
      }

      // Imposta lo stato 'Vista' a tutte le notifiche non lette per l'utente specificato
      await Notifica.updateMany(filter, { stato: statoNotificaEnum.SEEN }, { new: true });

      // Restituisce la risposta con lo stato 200
      res.status(200).json({ message: 'Tutte le notifiche sono state impostate come lette' });
    }
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
    const loggedUsername = req.utenteLoggato ? req.utenteLoggato.loggedUsername : null;

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

      // Controllo se l'utente loggato è diverso dall'utente richiesto
      if (loggedUsername !== username) {
        return res.status(403).json({ message: "Non hai i permessi per eliminare queste notifiche" });
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
    }
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