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

export {
    categorieInEnum
}

