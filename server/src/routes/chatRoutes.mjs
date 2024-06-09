import  Router  from "express";
import * as handlers from "../handlers/chatHandlers.mjs"
import tokenChecker from "../middlewares/tokenChecker.mjs";

const router = Router();

// Uso il middleware per verificare che l'utente sia utenticato
router.use("", tokenChecker.tokenChecker);

// Permette di ottenere le chats alle quali l'utente partecipa 
router.get("", handlers.getChatsByUsername);

// Permette di ottenere una chat dal suo id
router.get("/:idChat", handlers.getChatById);

// Permette di ottenere i messaggi di una chat
router.get("/:idChat/messaggi", handlers.getMessaggi);

// Permette di ottenere un messaggio nella chat
router.get("/:idChat/messaggi/:idMessaggio", handlers.getMessaggioById);

// Permette di pubblicare un messaggio in una chat
router.post("/:idChat/messaggi", handlers.postMessaggio);


export default router;