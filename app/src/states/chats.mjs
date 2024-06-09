import { ref } from 'vue'
import axios from 'axios'
import { loggedUser } from '../states/loggedUser.mjs'

const URL_API = import.meta.env.VITE_URL_API;
const CHAT_URL = URL_API+'/chat/'

const chat = ref({})
const messaggi = ref({})

async function fetchChats() {
	const response = await axios.get(CHAT_URL, {headers: {'Token': loggedUser.token}});
	chat.value = response.data.chats;
}

async function fetchChatById(idChat) {
    const response = await axios.get(CHAT_URL+idChat, {} ,{headers: {'Token': loggedUser.token}});
    chat.value = response.data.chat;
}

async function fetchMessaggi(idChat) {
    const response = await axios.delete(CHAT_URL+idChat+"/messaggi", {headers: {'Token': loggedUser.token}});
    messaggi.value = response.data.messaggi;
}

async function fetchMessaggioById(idChat, idMessaggio) {
    const response = await axios.get(CHAT_URL+idChat+"/messaggi/"+idMessaggio, {headers: {'Token': loggedUser.token}});
    messaggi.value = response.data.messaggio;
}

async function postMessaggio(idChat, contenuto) {
    await axios.post(CHAT_URL+idChat+"/messaggi", {contenuto: contenuto}, {headers: {'Token': loggedUser.token}});
}

export { 
    chat,
	messaggi,
    fetchChats,
    fetchChatById,
    fetchMessaggi,
    fetchMessaggioById,
    postMessaggio
} 