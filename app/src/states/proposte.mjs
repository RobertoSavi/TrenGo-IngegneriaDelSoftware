import { ref } from 'vue'
import axios from 'axios'
import { loggedUser } from '../states/loggedUser.mjs'

const API_URL = import.meta.env.VITE_API_HOST || `http://localhost:5050/api`
const PROPOSTE_URL = API_URL+'/proposte/'

const proposte = ref({})
const proposteIscritto = ref({})
const proposteTerminate = ref({})

async function fetchProposte() {
	const response = await axios.get(PROPOSTE_URL,  {headers: {'Token': loggedUser.token}});
	proposte.value = response.data.proposte;
}

async function fetchPropostaId(id) {
    const response = await axios.get(PROPOSTE_URL+id, {headers: {'Token': loggedUser.token}});
	proposte.value = response.data;
}

async function fetchPropostaIdValutazioni(id) {
    const response = await axios.get(PROPOSTE_URL+id+'?valutazioni=true', {headers: {'Token': loggedUser.token}});
	proposte.value = response.data;
}

async function fetchProposteMie() {
	const response = await axios.get(PROPOSTE_URL+'?mie=true',  {headers: {'Token': loggedUser.token}});
	proposte.value = response.data.proposte;
}

async function fetchProposteIscritto() {
	const response = await axios.get(PROPOSTE_URL+'?iscritto=true',  {headers: {'Token': loggedUser.token}});
	proposteIscritto.value = response.data.proposte;
}

async function fetchProposteTerminate() {
	const response = await axios.get(PROPOSTE_URL+'?terminate=true',  {headers: {'Token': loggedUser.token}});
	proposteTerminate.value = response.data.proposte;
}

async function fetchProposteNA(){
	const response = await axios.get(PROPOSTE_URL+'NA');
	proposte.value = response.data.proposte;
}

async function ricercaProposte(dati){
	
	var query="?";
	
	for (var key in dati)
	{		
		query+=key+"="+dati[key]+"&";
	}
	
	const response = await axios.get(PROPOSTE_URL+'ricerca'+query, {headers: {'Token': loggedUser.token}});
	proposte.value = response.data.proposte;
}

async function creaProposta(dati) {
	await axios.post(PROPOSTE_URL, dati, {headers: { 'Content-Type': 'application/json', 'Token': loggedUser.token}});
}

async function annullaPartecipazione(id) {
	await axios.put(PROPOSTE_URL+id+'/annullaPartecipazione', {}, {headers: { 'Content-Type': 'application/json', 'Token': loggedUser.token}});
}

async function modificaProposta(dati, id) {
	await axios.put(PROPOSTE_URL+id, dati, {headers: { 'Content-Type': 'application/json', 'Token': loggedUser.token}});
}

async function eliminaProposta(id) {
	await axios.delete(PROPOSTE_URL+id, {headers: { 'Content-Type': 'application/json', 'Token': loggedUser.token}});
}

export { 
	proposte,
	proposteIscritto,
	proposteTerminate,
	fetchProposte, 
	fetchPropostaId, 
	fetchPropostaIdValutazioni,
	fetchProposteMie, 
	fetchProposteIscritto,
	fetchProposteTerminate,
	fetchProposteNA, 
	ricercaProposte,
	creaProposta, 
	annullaPartecipazione,
	modificaProposta, 
	eliminaProposta 
} 