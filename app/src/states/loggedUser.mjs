import { reactive } from 'vue'

const URL_API = import.meta.env.VITE_URL_API;
const PROPOSTE_URL = URL_API+'/proposte/'

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

export {
	loggedUser,
	setLoggedUser,
	clearLoggedUser
} 