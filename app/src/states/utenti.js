// https://vuejs.org/guide/scaling-up/state-management.html#simple-state-management-with-reactivity-api

import { ref } from 'vue'
import axios from 'axios'
import { loggedUser } from './loggedUser.js'

const API_URL = import.meta.env.VITE_API_HOST || `http://localhost:5050`
const UTENTI_URL = API_URL+'/utenti/'

const utenti = ref([])

async function fetchUtenteUsername(username) {
    const response = await axios.get(UTENTI_URL+"username/"+username, {headers: {'Token': loggedUser.token}});
	utenti.value = response.data;
}

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



export { utenti, fetchUtenteUsername } 