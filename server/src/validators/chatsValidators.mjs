/**
 * Validatore per il contenuto di un messaggio
 * Verifica se il contenuto ha almeno un carattere
 * @param {string} contenuto - Il contenuto da validare.
 * @returns {boolean} - True se il contenuto è valido, altrimenti False.
 */
function validateContenuto(contenuto) {
    // Utilizza una regex per verificare che lo stato sia "accettata" o "rifiutata"
    if(contenuto.size<1)
    {
		return false;
	}
	
	return true;
}

export default validateContenuto;