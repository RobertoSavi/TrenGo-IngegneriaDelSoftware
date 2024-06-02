import  Router  from "express";
import * as handlers from "../handlers/followHandlers.mjs"
import tokenChecker from "../middlewares/tokenChecker.mjs";

const router = Router();

// Uso il middleware per verificare che l'utente sia utenticato
router.use("", tokenChecker);

// Permette di seguire un utente tramite username
router.put("/follow/:username", handlers.follow);

// Permette smettere di seguire un utente tramite username
router.put("/unfollow/:username", handlers.unfollow);

export default router;
