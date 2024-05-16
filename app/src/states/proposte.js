// https://vuejs.org/guide/scaling-up/state-management.html#simple-state-management-with-reactivity-api

import { ref } from 'vue'
import axios from 'axios'
import { loggedUser } from '../states/loggedUser.js'

const API_URL = import.meta.env.VITE_API_HOST || `http://localhost:5050`
const PROPOSTE_URL = API_URL+'/proposte/'

const proposte = ref({})

async function fetchProposte() {
	const response = await axios.get(PROPOSTE_URL,  {headers: {'Token': loggedUser.token}});
	proposte.value = response.data.proposte;
}

async function fetchPropostaId(id) {
    const response = await axios.get(PROPOSTE_URL+id, {headers: {'Token': loggedUser.token}});
	proposte.value = response.data;
}

async function creaProposta(dati) {
	console.log(dati);
	await axios.post(PROPOSTE_URL, dati, {headers: { 'Content-Type': 'application/json', 'Token': loggedUser.token}});;
};

/*async function deleteBook(book) {
    await fetch(HOST+book.self, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
    fetchBooks()
};

async function takeBook(book) {
    await fetch(LENDINGS_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': loggedUser.token
        },
        body: JSON.stringify( { student: loggedUser.self, book: book.self } ),
    })
};*/



export { proposte, fetchPropostaId, fetchProposte, creaProposta } 