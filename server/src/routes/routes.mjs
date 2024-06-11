import utentiRouter from "./utentiRoutes.mjs";
import proposteRouter from "./proposteRoutes.mjs";
import richiesteRouter from "./richiesteRoutes.mjs";
import notificheRouter from "./notificheRoutes.mjs";
import followRouter from "./followRoutes.mjs";
import valutazioniRouter from "./valutazioniRoutes.mjs";
import googleAuthRouter from "./googleAuthRoutes.mjs";
import chatRouter from "./chatRoutes.mjs";
import Router from "express";


const router = Router();

// Utilizza le route
router.use("/utenti", utentiRouter); // Route per gli utenti
router.use("/utenti", followRouter); // Route per i follow
router.use("/proposte", proposteRouter); // Route per le proposte
router.use("/proposte", richiesteRouter); // Route per le richieste
router.use("/notifiche", notificheRouter); // Route per le notifiche
router.use("/valutazioni", valutazioniRouter); // Route per le valutazioni
router.use("/utenti/auth/google", googleAuthRouter); // Route per l'autenticazione con google
router.use("/chat", chatRouter); // Route per la chat


export default router;