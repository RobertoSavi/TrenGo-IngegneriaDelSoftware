import  Router  from "express";
import * as handlers from "../handlers/notificheHandlers.mjs"
import tokenChecker from "../middlewares/tokenChecker.mjs";

const router = Router();

// Uso il middleware per verificare che l'utente sia utenticato
router.use("", tokenChecker.tokenChecker);

// Permette di creare una nuova notifica
router.post("/", handlers.postNotifica);

// Permette di aggiornare una notifica specifica per ID
router.put("/:id", handlers.setAsReadById);

// Permette di eliminare una notifica specifica per ID
router.delete("/:id", handlers.deleteNotificaById);

// Permette di ottenere tutte le notifiche
router.get("/utenti/:username", handlers.getNotificheByUsername);

// Permette di impostare tutte le notifiche come lette per un utente specifico
router.put("/utenti/:username", handlers.setAllASReadByUsername);

// Permette di eliminare tutte le notifiche per un utente specifico
router.delete("/utenti/:username", handlers.deleteNotificheByUsername);



export default router;