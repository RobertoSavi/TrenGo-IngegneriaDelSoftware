import axios from 'axios'
import { loggedUser } from '../states/loggedUser.mjs'

const URL_API = import.meta.env.VITE_URL_API;
const FOLLOW_HOST = URL_API+'/segui/'

async function follow(username) {
	await axios.put(FOLLOW_HOST+'follow/'+username, {}, {headers: {'Token': loggedUser.token}});
}

async function unfollow(username) {
    await axios.put(FOLLOW_HOST+'unfollow/'+username, {}, {headers: {'Token': loggedUser.token}});
}

export { 
    follow,
	unfollow
} 