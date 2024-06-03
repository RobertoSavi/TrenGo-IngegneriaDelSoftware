<script setup>
import { ref } from 'vue'
import { loggedUser, setLoggedUser, clearLoggedUser } from '../states/loggedUser.js'
import { login } from '../states/utenti.js'
import { RouterLink } from 'vue-router'
import router from '../router/index.js'

const dati=ref({
	username: "example_username",
	password: "example_passworD1"
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
		<h2>Login</h2>
		<div>
			<label>Username:</label>
			<input type="text" v-model="dati.username" required />
		</div>
		<div>
			<label>Password:</label>
			<input type="password" v-model="dati.password" required />
		</div>
		<div>
			<button type="submit">Accedi</button>
			<RouterLink :to="'/passworddimenticata'">Password dimenticata?</RouterLink>
			<br>
			<RouterLink :to="'/signup'">Non hai un account?</RouterLink>
		</div>
  	</form>
</template>
