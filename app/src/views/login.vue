<script setup>
import { ref, onMounted } from 'vue'
import { loggedUser, setLoggedUser } from '../states/loggedUser.mjs'
import { errori, login } from '../states/utenti.mjs'
import { RouterLink, useRoute } from 'vue-router'
import router from '../router/index.mjs'

const URL_API = import.meta.env.VITE_URL_API;
const URL_GOOGLE_LOGIN = URL_API + '/utenti/auth/google';
const erroreSuccesso = ref(false)
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
	username: "",
	password: ""
})

async function loginButton() {
	erroreSuccesso.value = false;
	errori.value = [];
	
	const response = await login(dati.value)
	
	if(errori.value.length==0)
	{
		setLoggedUser(response.data);
		router.push('/');
	}
	else
	{
		erroreSuccesso.value = true;
	}
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
		<div class="alert" v-if="erroreSuccesso">
			<span class="closebtn" @click="erroreSuccesso = false">&times;</span>
			<p>Qualcosa è andato storto:</p>
			<p v-for="errore in errori">{{ errore.message }}</p>
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