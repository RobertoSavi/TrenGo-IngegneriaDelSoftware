import { ref } from 'vue'
import axios from 'axios'
import { loggedUser } from './loggedUser.js'

const API_URL = import.meta.env.VITE_API_HOST || `http://localhost:5050`
const UTENTI_URL = API_URL+'/utenti/'

const utenti = ref({})

async function fetchUtenteUsername(username) {
    const response = await axios.get(UTENTI_URL+"username/"+username, {headers: {'Token': loggedUser.token}});
	utenti.value = response.data;
}

async function modificaUtente(dati, id) {
	await axios.put(UTENTI_URL+id, dati, {headers: { 'Content-Type': 'application/json', 'Token': loggedUser.token}});;
};

export { 
	utenti, 
	fetchUtenteUsername, 
	modificaUtente 
} 