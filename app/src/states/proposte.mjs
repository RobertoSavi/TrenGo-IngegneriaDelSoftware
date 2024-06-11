import { ref } from 'vue'
import axios from 'axios'

const token=localStorage.getItem('token');
const URL_API = import.meta.env.VITE_URL_API;
const PROPOSTE_URL = URL_API + '/proposte/'

const proposte = ref({})
const proposteIscritto = ref({})
const proposteTerminate = ref({})
const errori = ref([])

async function fetchProposte() {
	const response = await axios.get(PROPOSTE_URL, { headers: { 'Token': token } });
	proposte.value = response.data.proposte;
}

async function fetchPropostaId(id) {
	const response = await axios.get(PROPOSTE_URL + id, { headers: { 'Token': token } });
	proposte.value = response.data;
}

async function fetchPropostaIdValutazioni(id) {
	const response = await axios.get(PROPOSTE_URL + id + '?valutazioni=true', { headers: { 'Token': token } });
	proposte.value = response.data;
}

async function fetchProposteMie() {
	const response = await axios.get(PROPOSTE_URL + '?mie=true', { headers: { 'Token': token } });
	proposte.value = response.data.proposte;
}

async function fetchProposteIscritto() {
	const response = await axios.get(PROPOSTE_URL + '?iscritto=true', { headers: { 'Token': token } });
	proposteIscritto.value = response.data.proposte;
}

async function fetchProposteTerminate() {
	const response = await axios.get(PROPOSTE_URL + '?terminate=true', { headers: { 'Token': token } });
	proposteTerminate.value = response.data.proposte;
}

async function fetchProposteNA() {
	const response = await axios.get(PROPOSTE_URL);
	proposte.value = response.data.proposte;
}

async function ricercaProposte(dati) {

	var query = "?";

	for (var key in dati) {
		query += key + "=" + dati[key] + "&";
	}

	const response = await axios.get(PROPOSTE_URL + 'ricerca' + query, { headers: { 'Token': token } });
	proposte.value = response.data.proposte;
}

async function creaProposta(dati) {
	await axios.post(PROPOSTE_URL, dati, { headers: { 'Content-Type': 'application/json', 'Token': token } })
	.catch(
		function(error) {
			errori.value = JSON.parse(error.response.request.response).errors;
		}
	);
}

async function annullaPartecipazione(id) {
	await axios.put(PROPOSTE_URL + id + '/annullaPartecipazione', {}, { headers: { 'Content-Type': 'application/json', 'Token': token } });
}

async function modificaProposta(dati, id) {
	await axios.put(PROPOSTE_URL + id, dati, { headers: { 'Content-Type': 'application/json', 'Token': token } })
	.catch(
		function(error) {
			console.log(error);
			errori.value = JSON.parse(error.response.request.response).errors;
		}
	);
}

async function eliminaProposta(id) {
	await axios.delete(PROPOSTE_URL + id, { headers: { 'Content-Type': 'application/json', 'Token': token } });
}

export {
	errori,
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