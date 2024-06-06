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

export {
	loggedUser,
	setLoggedUser,
	clearLoggedUser
} 