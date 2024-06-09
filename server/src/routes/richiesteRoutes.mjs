import  Router  from "express";
import * as handlers from "../handlers/richiesteHandlers.mjs"
import tokenChecker from "../middlewares/tokenChecker.mjs";

const router = Router();

// Uso il middleware per verificare che l'utente sia utenticato
router.use("", tokenChecker.tokenChecker);

// Permette di ottenere le richieste di partecipazione ad una proposta
router.get("/:idProposta/richieste", handlers.getRichieste);

// Permette di ottenere una richiesta di partecipazione ad una proposta
router.get("/:idProposta/richieste/:id", handlers.getRichiestaById);

// Permette di pubblicare una richiesta di partecipazione ad una proposta
router.post("/:idProposta/richieste", handlers.postRichiesta);

// Permette di modificare una richiesta di partecipazione ad una proposta
// Usato dal creatore della proposta per accettare o rifiutare una richiesta
router.put("/:idProposta/richieste/:id", handlers.handleRichiestaById);

// Permette di eliminare una richiesta tramite l'id
router.delete("/:idProposta/richieste/:id", handlers.deleteRichiestaById);

export default router;