import passport from 'passport';
import googleAuth from "../services/googleAuth.mjs";
import dotenv from "dotenv";
dotenv.config();

const URL_FRONTEND = process.env.URL_FRONTEND;
const URL_LOGIN = URL_FRONTEND + 'login';

// Funzione per l'autenticazione con Google
function googleAuthentication(req, res, next) {
    googleAuth.authenticate('google', { scope: ['email', 'profile'] })(req, res, next);
}

// Funzione per il callback dell'autenticazione con Google
function googleCallback(req, res, next) {
    googleAuth.authenticate('google', (err, token) => {
        if (err) { return next(err); }
        if (!token) { return res.redirect(URL_LOGIN); }
        // Redireziono l'utente alla pagina di login con il token in query string
        res.redirect(`${URL_LOGIN}?token=${encodeURIComponent(token.token)}&loggedId=${encodeURIComponent(token.loggedId)}&loggedUsername=${encodeURIComponent(token.loggedUsername)}&self=${encodeURIComponent("utenti/" + token.loggedId)}`);
    })(req, res, next);
}

export {
    googleAuthentication,
    googleCallback
}