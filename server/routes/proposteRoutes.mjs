import  Router  from "express";
import * as handlers from "../handlers/proposteHandlers.mjs"

const router = Router();

// Permette di ottenere le proposte
router.get("", handlers.getProposte);

// Permette di pubblicare una proposta
router.post("", handlers.postProposta);

// Permette di modificare una proposta
router.put("/:id", handlers.modifyPropostaById);

// Permette di eliminare una proposta
router.delete("/:id", handlers.deletePropostaById);

// Permette di richiedere di partecipare ad una proposta
//router.post("/proposta/:id/partecipa", handlers.partecipaProposta);

export default router;