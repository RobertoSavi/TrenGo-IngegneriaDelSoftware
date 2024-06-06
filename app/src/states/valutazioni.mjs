import { ref } from 'vue'
import axios from 'axios'
import { loggedUser } from '../states/loggedUser.mjs'

const API_URL = import.meta.env.VITE_API_HOST || `http://localhost:5050/api`
const PROPOSTE_URL = API_URL+'/proposte/'
const VALUTAZIONI_URL = API_URL+'/valutazioni/'

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