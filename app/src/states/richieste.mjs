import { ref } from 'vue'
import axios from 'axios'

const token=localStorage.getItem('token');
const URL_API = import.meta.env.VITE_URL_API;
const PROPOSTE_URL = URL_API+'/proposte/'

const richieste = ref({})

async function fetchRichieste(id) {
	const response = await axios.get(PROPOSTE_URL+id+'/richieste',  {headers: {'Token': token}});
	if(response.data.richiesta)
	{
		richieste.value = response.data.richiesta;
	}
	else
	{
		richieste.value = response.data.richieste;
	}
}

async function creaRichiesta(dati, id) {
	await axios.post(PROPOSTE_URL+id+'/richieste', dati, {headers: {'Token': token}});
}

async function gestisciRichiesta(dati, id, idRichiesta) {
	await axios.put(PROPOSTE_URL+id+'/richieste/'+idRichiesta, dati, {headers: {'Token': token}});
}

async function annullaRichiesta(id, idRichiesta) {
	await axios.delete(PROPOSTE_URL+id+'/richieste/'+idRichiesta, {headers: {'Token': token}});
}

export { 
	richieste, 
	fetchRichieste,
	creaRichiesta,
	gestisciRichiesta,
	annullaRichiesta
} 