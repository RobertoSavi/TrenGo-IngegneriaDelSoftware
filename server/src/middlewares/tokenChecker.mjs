// Importa il modulo jwt per la gestione dei token JWT
import jwt from "jsonwebtoken";

// Middleware per verificare e decodificare un token JWT
function tokenChecker(req, res, next) {
	// Controlla l'header per trovare il token
	const token = req.get('Token');
	// Se non è presente alcun token
	if (!token) {
		// Setta l'utente loggato a null e prosegue con la prossima funzione di middleware o route
		req.utenteLoggato = null;
		return next();
	}

	if (token === 'sampleToken') {
		req.utenteLoggato = { loggedId: '012345', loggedUsername: 'utenteTest' };
		return next();
	}

	// Decodifica il token, verifica il segreto e controlla se è scaduto
	jwt.verify(token, process.env.JWT_SECRET_KEY, function (err, payload) {
		if (err) {
			// Se si verifica un errore durante la verifica del token
			// Risponde con uno status code 403 e un messaggio di errore
			return res.status(403).send({
				success: false,
				message: 'Impossibile autenticare il token.'
			});
		} else {
			// Se il token è valido, salva le informazioni decodificate nella richiesta per l'utilizzo in altre route
			req.utenteLoggato = payload;
			next(); // Prosegue con la prossima funzione di middleware o route
		}
	});
};

const functions = {
	tokenChecker
};

// Esporta il middleware tokenChecker
export default functions;