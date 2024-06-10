import axios from 'axios'
import { loggedUser } from '../states/loggedUser.mjs'

const URL_API = import.meta.env.VITE_URL_API;
const PROPOSTE_URL = URL_API+'/proposte/'
const VALUTAZIONI_URL = URL_API+'/valutazioni/'

async function valutaPartecipantiByIdProposta(idProposta, valutazione) {
    try {
        const response = await axios.post(
            `${VALUTAZIONI_URL}${idProposta}`,
            { valutazione },
            { headers: { 'Token': loggedUser.token } }
        );
        return response.data;
    } catch (error) {
        console.error("Error during the evaluation of the participants", error.message);
    }
}

async function valutaPartecipanteByUsername(idProposta, username, valutazione) {
    try {
        const response = await axios.post(
            `${VALUTAZIONI_URL}${idProposta}/${username}`,
            { valutazione },
            { headers: { 'Token': loggedUser.token } }
        );
        return response.data;
    } catch (error) {
        console.error("Error during the evaluation of the participant", error.message);
    }
}

export {
    valutaPartecipantiByIdProposta,
    valutaPartecipanteByUsername
}