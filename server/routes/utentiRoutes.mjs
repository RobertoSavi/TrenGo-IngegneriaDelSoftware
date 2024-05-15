import  Router  from "express";
import * as handlers from "../handlers/utentiHandlers.mjs";
import tokenChecker from "../validators/tokenChecker.mjs";

const router = Router();

// Permette la registrazione di un utente
router.post("/signup", handlers.signupUtente);

// Permette il login di un utente
router.post("/login", handlers.loginUtente);

// Middleware
router.use("/:id", tokenChecker);
router.use("/username/:username", tokenChecker);

// Permette di ottenere i dati di un utente tramite l'id
router.get("/:id", handlers.getUtenteById);

// Permette di modificare un utente tramite l'id
router.put("/:id", handlers.updateUtenteById);

// Permette di ottenere i dati di un utente tramite l'username
router.get("/username/:username", handlers.getUtenteByUsername);

// Esporta router
export default router;
