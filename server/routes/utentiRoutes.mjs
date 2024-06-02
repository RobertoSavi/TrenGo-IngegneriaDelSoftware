import  Router  from "express";
import * as handlers from "../handlers/utentiHandlers.mjs";
import tokenChecker from "../middlewares/tokenChecker.mjs";

const router = Router();

// Permette la registrazione di un utente
router.post("/signup", handlers.signupUtente);

// Permette il login di un utente
router.post("/login", handlers.loginUtente);

// Permette di ottenere tutti gli interessi disponibili
router.get("/interessi", handlers.getInteressi);

// Permette di richiedere il cambio della password
router.post("/passworddimenticata", handlers.changePasswordRequest);

// Permette di cambiare la password
router.post("/cambiopassword/:token", handlers.changePassword);

// Middleware
//router.use("/:id", tokenChecker);
//router.use("/username/:username", tokenChecker);

// Permette di ottenere i dati di un utente tramite l'id
router.get("/:id", tokenChecker, handlers.getUtenteById);

// Permette di modificare un utente tramite l'id
router.put("/:id", tokenChecker, handlers.updateUtenteById);

// Permette di ottenere i dati di un utente tramite l'username
router.get("/username/:username", tokenChecker, handlers.getUtenteByUsername);

// Esporta router
export default router;
