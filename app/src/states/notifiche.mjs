import { ref } from 'vue'
import axios from 'axios'

const token=localStorage.getItem('token');
const loggedUsername=localStorage.getItem('username');
const URL_API = import.meta.env.VITE_URL_API;
const PROPOSTE_URL = URL_API+'/proposte/'
const NOTIFICHE_URL = URL_API+'/notifiche/'

const notifiche = ref({})

async function fetchNotifiche() {
	const response = await axios.get(NOTIFICHE_URL+"utenti/"+loggedUser.username, {headers: {'Token': token}});
	notifiche.value = response.data;
}

async function setAllAsRead() {
    await axios.put(NOTIFICHE_URL+"utenti/"+loggedUser.username, {} ,{headers: {'Token': token}});
    await fetchNotifiche();
}

async function deleteAll() {
    await axios.delete(NOTIFICHE_URL+"utenti/"+loggedUser.username, {headers: {'Token': token}});
    await fetchNotifiche();
}

async function readNotifica(id) {
    await axios.put(NOTIFICHE_URL+id, {}, {headers: {'Token': token}});
    await fetchNotifiche();
}

async function deleteNotifica(id) {
    await axios.delete(NOTIFICHE_URL+id, {headers: {'Token': token}});
    await fetchNotifiche();
}

export { 
    notifiche,
	fetchNotifiche,
    setAllAsRead,
    deleteAll,
    readNotifica,
    deleteNotifica
} 