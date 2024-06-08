import { ref } from 'vue'
import axios from 'axios'
import { loggedUser } from '../states/loggedUser.mjs'

const API_URL = import.meta.env.VITE_API_HOST || `http://localhost:5050/api`
const PROPOSTE_URL = API_URL+'/proposte/'

const richieste = ref({})

async function fetchRichieste(id) {
	const response = await axios.get(PROPOSTE_URL+id+'/richieste',  {headers: {'Token': loggedUser.token}});
	if(response.data.richiesta)
	{
		richieste.value = response.data.richiesta;
		console.log(response.data.richieste);
	}
	else
	{
		richieste.value = response.data.richieste;
		console.log(response.data.richieste);
	}
}

async function creaRichiesta(dati, id) {
	await axios.post(PROPOSTE_URL+id+'/richieste', dati, {headers: {'Token': loggedUser.token}});
}

async function gestisciRichiesta(dati, id, idRichiesta) {
	console.log(dati);
	console.log(id)
	console.log(idRichiesta);
	await axios.put(PROPOSTE_URL+id+'/richieste/'+idRichiesta, dati, {headers: {'Token': loggedUser.token}});
}

export { 
	richieste, 
	fetchRichieste,
	creaRichiesta,
	gestisciRichiesta
} 