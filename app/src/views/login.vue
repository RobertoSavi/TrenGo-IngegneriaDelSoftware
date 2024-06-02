<script setup>
import { ref } from 'vue'
import { loggedUser, setLoggedUser, clearLoggedUser } from '../states/loggedUser.js'
import { login } from '../states/utenti.js'
import { RouterLink } from 'vue-router'
import router from '../router/index.js'

const API_URL = import.meta.env.VITE_API_HOST || `http://localhost:5050/api`
const UTENTI_URL = API_URL+`/utenti`

const dati=ref({
	username: "",
	password: ""
})

async function loginButton() {
	const response = await login(dati.value)	
	setLoggedUser(response.data);
	
	console.log(loggedUser.username);
	router.push('/');
};


function logout() {
  clearLoggedUser()
}

</script>

<template>
	<form @submit="loginButton()" @submit.prevent="submitForm" 	v-if="!loggedUser.token">
		<div>
			<h2>Login</h2>
		</div>
		<div>
			<label>Username: </label>
			<input name="username" v-model="dati.username" required />
		</div>
		<div>
			<label>Password: </label>
			<input name="password" v-model="dati.password" required />
		</div>
		<div>
			<button type="submit">Accedi</button>
			<RouterLink :to="'/passworddimenticata'">Password dimenticata?</RouterLink>
			<br>
			<RouterLink :to="'/signup'">Non hai un account?</RouterLink>
		</div>
  	</form>
</template>
