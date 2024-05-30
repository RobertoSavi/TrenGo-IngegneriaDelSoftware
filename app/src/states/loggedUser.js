// https://vuejs.org/guide/scaling-up/state-management.html#simple-state-management-with-reactivity-api

import { reactive } from 'vue'

const API_URL = import.meta.env.VITE_API_HOST || `http://localhost:5050`
const PROPOSTE_URL = API_URL+'/proposte/'

const loggedUser = reactive({
	token: undefined,
	username: undefined,
	id: undefined,
	self: undefined
})

function setLoggedUser(dati) {
	loggedUser.token = dati.token;
	loggedUser.username = dati.loggedUsername;
	loggedUser.id = dati.loggedId;
	loggedUser.self = dati.self;
}

function clearLoggedUser() {
	loggedUser.token = undefined;
	loggedUser.username = undefined;
	loggedUser.id = undefined;
	loggedUser.self = undefined;
}

async function signup(dati) {
	const response = await axios.post(PROPOSTE_URL+'mie',  {headers: {'Token': loggedUser.token}});
	proposte.value = response.data.proposte;
}

export {
	loggedUser,
	setLoggedUser,
	clearLoggedUser,
	signup
} 