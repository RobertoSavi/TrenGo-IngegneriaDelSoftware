//import Richiesta from "../models/richiestaModel.mjs"
//import  {interessiEnum}  from '../models/enums.mjs';

/**
 * Validatore per lo stato delle proposte.
 * Verifica se lo stato è uguale a "accettata" o "rifiutata".
 * @param {string} stato - Lo stato da validare.
 * @returns {boolean} - True se lo stato è valido, altrimenti False.
 */
function validateStato(stato) {
    // Utilizza una regex per verificare che lo stato sia "accettata" o "rifiutata"
    return /^(accettata|rifiutata)$/.test(stato);
}

export default validateStato;

