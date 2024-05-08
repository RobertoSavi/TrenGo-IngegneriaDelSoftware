import express from "express";
import {getUtenteById, updateUtenteById, getUtenteByUsername, signupUtente, loginUtente} from "../handlers/utentiHandlers.mjs"


const router = express.Router();

// Permette di ottenere i dati di un utente tramite l'id
router.get("/:id", getUtenteById);

// Permette di modificare un utente tramite l'id
router.put("/:id", updateUtenteById);

// Permette di di ottenere i dati di un utente tramite l'username
router.get("/:username", getUtenteByUsername);

// Permette la registrazione di un utente
router.post("/signup", signupUtente);

// Permette il login di un utente
router.post("/login", loginUtente);


// Esporta router
module.exports = router;
