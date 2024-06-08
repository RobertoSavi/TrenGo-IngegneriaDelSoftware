<script setup>
import { ref, onMounted, watch, onUpdated } from 'vue'
import { loggedUser, setLoggedUser, clearLoggedUser } from '../states/loggedUser.mjs'
import { login } from '../states/utenti.mjs'
import { RouterLink, useRoute } from 'vue-router'
import router from '../router/index.mjs'

const URL_API = import.meta.env.VITE_URL_API;
const URL_GOOGLE_LOGIN = URL_API + '/utenti/auth/google';

const route = useRoute()

const handleRouteChange = async () => {
	// Se sono presenti dei parametri nella query string vuol dire che l'utente ha appena effettuato il login tramite Google
	if (route.query.token) {
		const objectFromQueryParams = {
			token: route.query.token || '',
			loggedId: route.query.loggedId || '',
			loggedUsername: route.query.loggedUsername || '',
			self: route.query.self || ''
		};
		setLoggedUser(objectFromQueryParams);

		router.push('/');
	}
};

onMounted(() => {
	handleRouteChange();
});


const dati = ref({
	username: "example_username",
	password: "example_passworD1"
})

async function loginButton() {
	const response = await login(dati.value)
	console.log(response.data);
	setLoggedUser(response.data);
	router.push('/');
};

async function googleLoginButton() {
	window.location.href = URL_GOOGLE_LOGIN;
}

</script>

<template>
	<form @submit="loginButton()" @submit.prevent="submitForm" v-if="!loggedUser.token">
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
			<button type="button" @click="googleLoginButton()">Accedi con Google</button>
			<RouterLink :to="'/passworddimenticata'">Password dimenticata?</RouterLink>
			<br>
			<RouterLink :to="'/signup'">Non hai un account?</RouterLink>

		</div>
	</form>
</template>