import * as propostaModel from "../models/propostaModel.mjs"
import  {interessiEnum}  from '../models/enums.mjs';

/**
* Controlla se una categoria rientra nell'elenco di categorie definite come enumerazione.
* @param {string} categoria - La categoria da controllare.
* @returns {boolean} Restituisce true se la categoria è presente nell'enum, altrimenti false.
*/
function categorieInEnum(categorie) {
    // Se categorie è una stringa, trasformala in un array contenente una singola categoria
    if (!Array.isArray(categorie)) {
        categorie = [categorie];
    }

    // Controlla se ogni categoria è presente nell'elenco delle categorie consentite
    return categorie.every(categoria => interessiEnum.includes(categoria));
}

/**
 * Validatore per il titolo delle proposte.
 * Verifica che il titolo sia lungo tra 5 e 30 caratteri.
 * @param {string} titolo - Il titolo da validare.
 * @returns {boolean} - True se il titolo è valido, altrimenti False.
 */
function validateTitolo (titolo) {
    // Verifica se il titolo ha una lunghezza compresa tra 5 e 30 caratteri
    return titolo.length >= 5 && titolo.length <= 30;
};

/**
 * Validatore per la descrizione delle proposte.
 * Verifica che la descrizione sia lunga al massimo 200 caratteri.
 * @param {string} descrizione - La descrizione da validare.
 * @returns {boolean} - True se la descrizione è valida, altrimenti False.
 */
function validateDescrizione (descrizione) {
    // Verifica se la descrizione ha una lunghezza massima di 200 caratteri
    return descrizione.length <= 200;
};

export {
    categorieInEnum,
    validateTitolo,
    validateDescrizione
}

