import { ref } from 'vue'
import axios from 'axios'
import { loggedUser } from './loggedUser.js'

const URL_API = import.meta.env.VITE_URL_API;
const UTENTI_URL = URL_API+'/utenti/'

const utenti = ref({})
const interessi = ref({})

async function fetchUtenteUsername(username) {
	const response = await axios.get(UTENTI_URL + "username/" + username, { headers: { 'Token': loggedUser.token } });
	utenti.value = response.data;
}

async function modificaUtente(dati, id) {
	await axios.put(UTENTI_URL + id, dati, { headers: { 'Content-Type': 'application/json', 'Token': loggedUser.token } });
};

async function changePasswordRequest(dati) {
	await axios.post(UTENTI_URL + "passworddimenticata", dati, { headers: { 'Content-Type': 'application/json' } });
};

async function changePassword(dati, token) {
	await axios.post(UTENTI_URL + "cambiopassword/" + token, dati, { headers: { 'Content-Type': 'application/json' } });
	await axios.put(UTENTI_URL + id, dati, { headers: { 'Content-Type': 'application/json', 'Token': loggedUser.token } });;
};

async function getInteressi() {
	const response = await axios.get(UTENTI_URL + "interessi");
	interessi.value = response.data.interessi;
}

async function signup(dati){
	await axios.post(UTENTI_URL + "signup", dati, { headers: { 'Content-Type': 'application/json' } });
}

async function login(dati){
	const response = await axios.post(UTENTI_URL + "login", dati, { headers: { 'Content-Type': 'application/json' } });
	return response;
}

export {
	utenti,
	interessi,
	fetchUtenteUsername,
	modificaUtente,
	changePasswordRequest,
	changePassword,
	getInteressi,
	signup,
	login
} 