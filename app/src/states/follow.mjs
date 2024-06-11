import axios from 'axios'

const token=localStorage.getItem('token');
const URL_API = import.meta.env.VITE_URL_API;
const FOLLOW_HOST = URL_API+'/utenti/'

async function follow(username) {
	await axios.put(FOLLOW_HOST+'follow/'+username, {}, {headers: {'Token': token}});
}

async function unfollow(username) {
    await axios.put(FOLLOW_HOST+'unfollow/'+username, {}, {headers: {'Token': token}});
}

export { 
    follow,
	unfollow
} 