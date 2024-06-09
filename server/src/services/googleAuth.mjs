import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import {googleLogin} from '../handlers/utentiHandlers.mjs';
import dotenv from 'dotenv';
dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true,
},
async function (request, accessToken, refreshToken, profile, done) { // Mark this function as async
    try {
        // Await the Promise returned by googleLogin
        const token = await googleLogin(profile); // Adjusted to pass profile directly
        console.log(token);
        return done(null, token); // On success, pass null as the first argument to indicate no error
    } catch (err) {
        return done(err); // Pass the error to done if something goes wrong
    }
}));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

export default passport;

