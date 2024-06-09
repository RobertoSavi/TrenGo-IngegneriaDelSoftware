import { tipoNotificaEnum } from "../models/enums.mjs";


/**
* Controlla se un tipo rientra nell'elenco di tipi definiti come enumerazione.
* @param {string} categoria - La categoria da controllare.
* @returns {boolean} Restituisce true se la categoria è presente nell'enum, altrimenti false.
*/
function tipoInEnum(tipo) {
    return tipoNotificaEnum.includes(tipo);
}

export {
    tipoInEnum
}
