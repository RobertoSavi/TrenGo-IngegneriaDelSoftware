import  Router  from "express";
import * as handlers from "../handlers/valutazioniHandlers.mjs"
import tokenChecker from "../middlewares/tokenChecker.mjs";

const router = Router();

// Uso il middleware per verificare che l'utente sia utenticato
router.use("", tokenChecker);

// Permette di valutare tutti i partecipanti ad una proposta tramite idProposta
router.post("/:idProposta", handlers.valutaPartecipantiByIdProposta);

// Permette di valutare un partecipante ad una proposta tramite username
router.post("/:idProposta/:username", handlers.valutaPartecipanteByUsername);

export default router;