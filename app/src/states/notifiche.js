import { ref } from 'vue'
import axios from 'axios'
import { loggedUser } from '../states/loggedUser.js'
//import Notifica from '../../../server/models/notificaModel.mjs';

const API_URL = import.meta.env.VITE_API_HOST || `http://localhost:5050`
const PROPOSTE_URL = API_URL+'/proposte/'
const NOTIFICHE_URL = API_URL+'/notifiche/'

const notifiche = ref({})
//const proposteIscritto = ref({})

async function fetchNotifiche() {
	const response = await axios.get(NOTIFICHE_URL+"utenti/"+loggedUser.username,  {headers: {'Token': loggedUser.token}});
	notifiche.value = response.data;
}

async function setAllAsRead() {
    await axios.put(NOTIFICHE_URL+"utenti/"+loggedUser.username, {headers: {'Token': loggedUser.token}});
    await fetchNotifiche();
}

async function deleteAll() {
    await axios.delete(NOTIFICHE_URL+"utenti/"+loggedUser.username, {headers: {'Token': loggedUser.token}});
    await fetchNotifiche();
}


export { 
    notifiche,
	fetchNotifiche,
    setAllAsRead,
    deleteAll
} 