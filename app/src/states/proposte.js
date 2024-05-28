// https://vuejs.org/guide/scaling-up/state-management.html#simple-state-management-with-reactivity-api

import { ref } from 'vue'
import axios from 'axios'
import { loggedUser } from '../states/loggedUser.js'
import { richieste, fetchRichieste } from '../states/richieste.js';

const API_URL = import.meta.env.VITE_API_HOST || `http://localhost:5050`
const PROPOSTE_URL = API_URL+'/proposte/'

const proposte = ref({})
const proposteIscritto = ref({})

async function fetchProposte() {
	const response = await axios.get(PROPOSTE_URL,  {headers: {'Token': loggedUser.token}});
	proposte.value = response.data.proposte;
}

async function fetchPropostaId(id) {
    const response = await axios.get(PROPOSTE_URL+id, {headers: {'Token': loggedUser.token}});
	proposte.value = response.data;
}

async function fetchProposteMie() {
	const response = await axios.get(PROPOSTE_URL+'mie',  {headers: {'Token': loggedUser.token}});
	proposte.value = response.data.proposte;
}

async function fetchProposteIscritto() {
	const response = await axios.get(PROPOSTE_URL+'iscritto',  {headers: {'Token': loggedUser.token}});
	proposteIscritto.value = response.data.proposte;
}

async function fetchProposteNA(){
	const response = await axios.get(PROPOSTE_URL+'NA');
	proposte.value = response.data.proposte;
}

async function creaProposta(dati) {
	await axios.post(PROPOSTE_URL, dati, {headers: { 'Content-Type': 'application/json', 'Token': loggedUser.token}});;
};

async function modificaProposta(dati, id) {
	await axios.put(PROPOSTE_URL+id, dati, {headers: { 'Content-Type': 'application/json', 'Token': loggedUser.token}});;
};

async function eliminaProposta(id) {
	await axios.delete(PROPOSTE_URL+id, {headers: { 'Content-Type': 'application/json', 'Token': loggedUser.token}});;
};

export { 
	proposte, 
	proposteIscritto, 
	fetchProposte, 
	fetchPropostaId, 
	fetchProposteMie, 
	fetchProposteIscritto, 
	fetchProposteNA, 
	creaProposta, 
	modificaProposta, 
	eliminaProposta 
} 