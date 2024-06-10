import Utente from "../models/utenteModel.mjs"
import validators from "../validators/utentiValidators.mjs";
import { interessiEnum } from "../models/enums.mjs";
import { sendResetPasswordMail } from "../services/emailService.mjs";
import { generateRandomPassword } from "../utils/passwordGenerator.mjs";
import Token from "../models/tokenModel.mjs";
import jwt from "jsonwebtoken"
import crypto from 'crypto';

/**
 * Ottiene un utente dal database utilizzando l'ID fornito.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function getUtenteById(req, res) {
    try {
        const { id } = req.params;
        const utente = await Utente.findById(id);
        const loggedId = req.utenteLoggato ? req.utenteLoggato.loggedId : null; // ID dell'utente loggato (se presente)

        // Se l'utente non è loggato
        if (!loggedId) {
            return res.status(401).send({
                success: false,
                message: 'Nessun token fornito.'
            });
        }
        else {
            if (!utente) {
                return res.status(404).json({ message: "Utente non trovato" });
            }

            // Se l'utente cercato è uguale all'utente loggato resituisco tutte le informazioni dell'utente
            if (utente.id == loggedId) {
                return res.status(200).json({ utente });
            }

            // Altrimenti ritorna solo le informazioni pubbliche
            return res.status(200).json({
                username: utente.username,
                tipoUtente: utente.tipoUtente,
                nome: utente.nome,
                cognome: utente.cognome,
                karma: utente.karma,
                interessi: utente.interessi,
                followers: utente.followers
            });
        }
    } catch (error) {
        return res.status(500).json({ message: "Errore durante il recupero dell'utente", error: error.message });
    }
}

/**
 * Ottiene gli utenti dal database in base a query specifiche.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function ricercaUtenti(req, res) {
	try {
		const loggedUsername = req.utenteLoggato ? req.utenteLoggato.loggedUsername : null; // Username dell'utente loggato
		const query = {};

		// Controlla i parametri della query
		const { username, maxKarma, minKarma } = req.query;

		if (username) {
			query.username = { $regex: new RegExp(username, 'i') };
		}

		if (maxKarma && minKarma) {
			query.numeroPartecipantiDesiderato = { $lte: maxKarma, $gte: minKarma };
		}
		else if (maxKarma) {
			query.numeroPartecipantiDesiderato = { $lte: maxKarma };
		}
		else if (minKarma) {
			query.numeroPartecipantiDesiderato = { $lte: minKarma };
		}

		// Se l'utente è loggato restituisco gli utenti cercati
		if (loggedUsername) {
			const utenti = await Utente.find(query, { password:0, _id:0, email:0, following:0, googleId:0 });
			
			if (!utenti) {
				return res.status(404).json({ message: "Nessun utente disponibile." });
			}

			return res.status(200).json({ utenti });
		}
		// Se l'utente non è loggato restituisco solo gli utenti grandi organizzatori
		else {
			query.tipoUtente = "grandeOrganizzatore";
			const utenti = await Utente.find(query, { password:0, _id:0, email:0, following:0, googleId:0 });

			if (!utenti) {
				return res.status(404).json({ message: "Nessun utente disponibile." });
			}

			return res.status(200).json({ utenti });
		}

	} catch (error) {
		return res.status(500).json({ message: "Errore durante il recupero degli utenti", error: error.message });
	}
}

/**
 * Aggiorna un utente nel database utilizzando l'ID fornito e i dati di aggiornamento.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function updateUtenteById(req, res) {
    try {
        const { id } = req.params;
        const updates = req.body;
        const loggedId = req.utenteLoggato ? req.utenteLoggato.loggedId : null; // ID dell'utente loggato (se presente)

        // Se l'utente non è loggato
        if (!loggedId) {
            return res.status(401).send({
                success: false,
                message: 'Nessun token fornito.'
            });
        }
        else {
            // Aggiorna il documento utente con tutti i campi forniti nel corpo della richiesta
            const utente = await Utente.findByIdAndUpdate(id, updates, { new: true });
            if (!utente) {
                return res.status(404).json({ message: "Utente non trovato" });
            }

            // Permetto la modifica dei dati utente solo se il chiamante dell'API è l'utente da modificare
            if (utente.id == loggedId) {
                // Aggiorna il documento utente con tutti i campi forniti nel corpo della richiesta
                const utente = await Utente.findByIdAndUpdate(id, updates, { new: true });
                return res.status(200).json({ self: "utenti/" + utente._id });
            }
            else {
                return res.status(403).json({ message: "Impossibile modificare account altrui" });
            }
        }
    } catch (error) {
        return res.status(500).json({ message: "Errore durante l'aggiornamento dell'utente", error: error.message });
    }
}

/**
 * Ottiene un utente dal database utilizzando l'username fornito.
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function getUtenteByUsername(req, res) {
    try {
        const { username } = req.params;
        const loggedUsername = req.utenteLoggato ? req.utenteLoggato.loggedUsername : null; // ID dell'utente loggato (se presente)
        const grandiOrganizzatori = await Utente.find({ tipoUtente: "grandeOrganizzatore" });
        // Mappa i username dei grandi organizzatori
        const grandiOrganizzatoriUsernames = grandiOrganizzatori.map(u => u.username);
        // Controlla se proposta.usernameCreatore è presente in grandiOrganizzatoriUsernames
        const isGrandeOrganizzatore = grandiOrganizzatoriUsernames.includes(username);
        // Se l'utente non è loggato
        if (!loggedUsername) {
            // Può visualizzare solo i grandi organizzatori
            if (isGrandeOrganizzatore) {
                const utente = await Utente.findOne({ username: username });
                return res.status(200).json({
                    "utente": {
                        username: utente.username,
                        tipoUtente: utente.tipoUtente,
                        nome: utente.nome,
                        cognome: utente.cognome,
                        karma: utente.karma,
                        interessi: utente.interessi,
                        followers: utente.followers
                    }
                });
            }
            // Se l'utente cercato non è un grande organizzatore, restituisci un errore
            else {
                return res.status(401).send({
                    success: false,
                    message: 'Nessun token fornito.'
                });
            }
        }
        else {
            // Trova l'utente nel database utilizzando lo username
            const utente = await Utente.findOne({ username: username });

            if (!utente) {
                return res.status(404).json({ message: "Utente non trovato" });
            }

            // Se l'utente cercato è uguale all'utente loggato resituisco tutte le informazioni dell'utente
            if (utente.username == loggedUsername) {
                return res.status(200).json({ utente });
            }

            // Altrimenti ritorna solo le informazioni pubbliche
            return res.status(200).json({
                "utente": {
                    username: utente.username,
                    tipoUtente: utente.tipoUtente,
                    nome: utente.nome,
                    cognome: utente.cognome,
                    karma: utente.karma,
                    interessi: utente.interessi,
                    followers: utente.followers
                }
            });
        }
    } catch (error) {
        return res.status(500).json({ message: "Errore durante il recupero dell'utente", error: error.message });
    }
}

/**
 * Effettua la registrazione di un utente con i dati passati nel body
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function signupUtente(req, res) {
    try {
        // Estrai i campi dal body della richiesta
        const { nome, cognome, username, email, password } = req.body;
        let { interessi } = req.body;
        // Inizializza un array per gli errori
        const errors = [];

        // Validazione dello username
        if (!validators.isUsernameValid(username))
            errors.push({ field: "username", message: "Username non valido" });

        // Validazione dell'email
        if (!validators.isEmailValid(email))
            errors.push({ field: "email", message: "Email non valida" });

        // Validazione della password
        if (!validators.isPasswordValid(password))
            errors.push({ field: "password", message: "Password non valida" });

        // Verifica se lo username è già in uso
        if (await validators.isUsernameTaken(username))
            errors.push({ field: "username", message: "Username già in uso" });

        // Verifica se l'email è già in uso
        if (await validators.isEmailTaken(email))
            errors.push({ field: "email", message: "Email già registrata" });

        // Gestione degli errori
        if (errors.length > 0) {
            return res.status(400).json({ message: "error", errors });
        }
        // Creazione dell'utente
        if (!interessi) {
            interessi = ["Altro"];
        }
        const utente = await Utente.create({ nome, cognome, username, email, password, interessi });
        return res.status(201).json({ self: "utenti/" + utente._id });

    } catch (error) {
        // Gestione dell'errore durante la creazione dell'utente
        return res.status(500).json({ message: "Errore durante la registrazione dell'utente", error: error.message });
    }
}

/**
 * Effettua il login di un utente con i dati passati nel body
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function loginUtente(req, res) {
    try {
        // Estrai username e password dal body della richiesta
        const { username, password } = req.body;

        // Find the user by username
        const utente = await validators.getUtente(username);

        // Ritorna errore, se l'utente non viene trovato
        if (!utente) {
            return res.status(401).json({ success: false, message: 'Utente non trovato' });
        }

        // Verifica la password
        const isPasswordCorrect = await validators.verifyPasswordByUsername(username, password);

        // Ritorna errore se la password non è corretta
        if (!isPasswordCorrect) {
            return res.status(401).json({ success: false, message: 'Password sbagliata' });
        }

        // Se l'utente è stato trovato e la password è corretta, crea un token JWT
        const payload = {
            loggedId: utente._id, // Aggiungi l'ID dell'utente come informazione nel payload del token
            loggedUsername: utente.username // Aggiungi l'username dell'utente come informazione nel payload del token
        };

        // Opzioni per la creazione del token JWT, incluso il tempo di scadenza
        const options = {
            expiresIn: process.env.JWT_EXPIRES_IN // Scadenza del token
        };

        // Crea un token JWT firmato utilizzando il payload, il segreto e le opzioni specificate
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, options);

        // Invia una risposta JSON contenente il token appena creato, insieme ad altre informazioni
        return res.status(200).json({
            token: token, // Il token JWT appena creato
            loggedId: utente._id, // ID dell'utente associato al token
            loggedUsername: utente.username, // Username dell'utente associato al token
            self: "utenti/" + utente._id // Link alla risorsa dell'utente nel formato API
        });

    } catch (error) {
        return res.status(500).json({ message: "Errore durante l'accesso dell'utente", error: error.message });
    }
}

/**
 * Restituisce l'elenco degli interessi
 * @param {object} req - L'oggetto della richiesta.
 * @param {object} res - L'oggetto della risposta.
 */
async function getInteressi(req, res) {
    try {
        const interessi = interessiEnum;
        return res.status(200).json({ interessi });
    } catch (error) {
        return res.status(500).json({ message: "Errore durante il recupero degli interessi", error: error.message });
    }
}

async function changePasswordRequest(req, res) {
    try {
        const { email } = req.body;
        const utente = await Utente.findOne({ email });

        if (!utente) {
            return res.status(400).json({ message: "Utente non trovato" });
        }

        // Creo un token e lo salvo nel database
        const token = crypto.randomBytes(20).toString('hex');
        await Token.create({ username: utente.username, token })

        // Crea il link per il reset della password
        const urlFrontend = process.env.URL_FRONTEND;
        const resetLink = `${urlFrontend}/cambiopassword/${token}`;

        // Send password reset email to the usesr
        await sendResetPasswordMail(utente.email, resetLink);

        return res.status(200).json({ message: "Email per il reset della password inviata" });
    } catch (error) {
        return res.status(500).json({ message: "Errore nell\'invio dell\'email per il reset della password ", error: error.message });
    }
}

async function changePassword(req, res) {
    try {
        const { token } = req.params;
        const { new_password } = req.body;
        // Inizializza un array per gli errori
        const errors = [];

        // Verifica il token
        const passedToken = await Token.findOne({ token });

        // Se il token non viene trovato, restituisce un errore
        if (!passedToken) {
            return res.status(404).json({ message: "Token non valido" });
        }

        // Validazione della password
        if (!validators.isPasswordValid(new_password))
            errors.push({ field: "password", message: "Password non valida" });

        // Gestione degli errori
        if (errors.length > 0)
            return res.status(400).json({ message: "error", errors });


        // Verifica la scadenza del token
        const tokenExpiration = new Date(passedToken.expirationDate).getTime();
        if (tokenExpiration < Date.now()) {
            // Se il token è scaduto, cancellalo dal database e restituisci un errore
            await Token.deleteOne({ passedToken });
            return res.status(404).json({ message: "Token scaduto" });
        }

        // Trova l'utente associato al token
        const utente = await Utente.findOne({ username: passedToken.username });

        // Aggiorna la password dell'utente
        utente.password = new_password;
        await utente.save();

        // Cancella il token dal database
        await Token.deleteOne({ passedToken });

        return res.status(200).json({ message: "Password aggiornata con successo" });
    } catch (error) {
        return res.status(500).json({ message: "Errore nell\'aggiornamento della password:", error: error.message });
    }
}

async function googleLogin(profile) {
    try {
        let utente;

        // Controlla se l'utente è già autenticato con Google
        const utenteGoogle = await Utente.findOne({ googleId: profile.id });

        if (!utenteGoogle) {
            const utenteEmail = await Utente.findOne({ email: profile.email });

            if (utenteEmail) {
                // Aggiorna il googleId dell'utente esistente
                utenteEmail.googleId = profile.id;
                await utenteEmail.save();
                utente = utenteEmail; // Usa l'utente autenticato per JWT
            } else {
                // Crea un nuovo utente con il profilo Google
                const nuovoUtente = {
                    googleId: profile.id,
                    username: profile.displayName,
                    email: profile.email,
                    nome: profile.given_name,
                    cognome: profile.family_name,
                    password: generateRandomPassword(), // Genera una password casuale per l'utente Google
                };
                utente = new Utente(nuovoUtente);
                await utente.save();
            }
        } else {
            utente = utenteGoogle; // Usa l'utente Google per JWT
        }

        // Genera il token JWT
        const payload = {
            loggedId: utente._id,
            loggedUsername: utente.username
        };
        const options = {
            expiresIn: process.env.JWT_EXPIRES_IN
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, options);

        // Restituisce il token JWT nella risposta
        return {
            token: token,
            loggedId: utente._id,
            loggedUsername: utente.username,
            self: "utenti/" + utente._id
        };
    } catch (err) {
        throw err;
    }
}

// Esporta handlers
export {
    getUtenteById,
    updateUtenteById,
    getUtenteByUsername,
    ricercaUtenti,
    signupUtente,
    loginUtente,
    getInteressi,
    changePasswordRequest,
    changePassword,
    googleLogin
};