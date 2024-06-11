import { ref } from 'vue'
import axios from 'axios'

const token=localStorage.getItem('token');
const URL_API = import.meta.env.VITE_URL_API;
const CHAT_URL = URL_API+'/chat/'

const chats = ref({})
const messaggi = ref({})

async function fetchChats() {
	const response = await axios.get(CHAT_URL, {headers: {'Token': token}});
	chats.value = response.data.chats;
}

async function fetchChatById(idChat) {
    const response = await axios.get(CHAT_URL+idChat, {headers: {'Token': token}});
    chats.value = response.data.chat;
}

async function fetchMessaggi(idChat) {
    const response = await axios.get(CHAT_URL+idChat+"/messaggi", {headers: {'Token': token}});
    messaggi.value = response.data.messaggi;
}

async function fetchMessaggioById(idChat, idMessaggio) {
    const response = await axios.get(CHAT_URL+idChat+"/messaggi/"+idMessaggio, {headers: {'Token': token}});
    messaggi.value = response.data.messaggio;
}

async function postMessaggio(idChat, contenuto) {
    await axios.post(CHAT_URL+idChat+"/messaggi", {contenuto: contenuto}, {headers: {'Token': token}});
}

export { 
    chats,
	messaggi,
    fetchChats,
    fetchChatById,
    fetchMessaggi,
    fetchMessaggioById,
    postMessaggio
} 