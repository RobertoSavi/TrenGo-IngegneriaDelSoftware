import passport from 'passport';
import googleAuth from "../services/googleAuth.mjs";
import dotenv from "dotenv";
dotenv.config();

const URL_FRONTEND = process.env.URL_FRONTEND;
const URL_LOGIN = URL_FRONTEND + 'login';

// Assuming googleAuth is an instance of passport
function googleAuthentication(req, res, next) {
    console.log('googleAuthentication');
    googleAuth.authenticate('google', { scope: ['email', 'profile'] })(req, res, next);
}
// Assuming googleAuth is an instance of passport
function googleCallback(req, res, next) {
    console.log('googleCallback');
    googleAuth.authenticate('google', (err, token) => {
        if (err) { return next(err); }
        if (!token) { return res.redirect(URL_LOGIN); }
        // User is authenticated and available here
        console.log('token ' + token.token); // Access the authenticated user
        /*res.status(200).json({
            token: token.token, // Il token JWT appena creato
            loggedId: token.loggedId, // ID dell'utente associato al token
            loggedUsername: token.loggedUsername, // Username dell'utente associato al token
            self: "utenti/" + token.loggedId // Link alla risorsa dell'utente nel formato API
        });*/
        //res.redirect(URL_FRONTEND); // Redirect or handle the response as needed
        res.redirect(`${URL_LOGIN}?token=${encodeURIComponent(token.token)}&loggedId=${encodeURIComponent(token.loggedId)}&loggedUsername=${encodeURIComponent(token.loggedUsername)}&self=${encodeURIComponent("utenti/" + token.loggedId)}`);
    })(req, res, next);
}

export {
    googleAuthentication,
    googleCallback
}