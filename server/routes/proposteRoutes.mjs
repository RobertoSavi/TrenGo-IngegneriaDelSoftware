import  Router  from "express";
import * as handlers from "../handlers/proposteHandlers.mjs"
import tokenChecker from "../middlewares/tokenChecker.mjs";

const router = Router();

// Permette di ottenere le proposte pubblicate da grandi organizzatori
router.get("/NA", handlers.getProposteNA);

// Uso il middleware per verificare che l'utente sia utenticato
router.use("", tokenChecker);

// Permette di ottenere le proposte
router.get("", handlers.getProposte);

// Permette di ottenere le mie proposte
router.get("/mie", handlers.getMieProposte);

// Permette di ottenere le proposte alle quali sono iscritto
router.get("/iscritto", handlers.getProposteIscritto);

// Permette di ottenere le proposte che coincidono con la query passata
router.get("/ricerca", handlers.ricercaProposte);

// Permette di ottenere una proposta tramite l'id
router.get("/:id", handlers.getPropostaById);

// Permette di pubblicare una proposta
router.post("", handlers.postProposta);

// Permette di annullare la partecipazione ad una proposta tramite l'id
router.put("/:id/annullaPartecipazione", handlers.annullaPartecipazioneById);

// Permette di modificare una proposta tramite l'id
router.put("/:id", handlers.modifyPropostaById);

// Permette di eliminare una proposta tramite l'id
router.delete("/:id", handlers.deletePropostaById);

export default router;