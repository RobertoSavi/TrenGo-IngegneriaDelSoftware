<script setup>
import { ref, onMounted, watch ,onUpdated} from 'vue'
import { loggedUser, setLoggedUser, clearLoggedUser } from '../states/loggedUser.js'
import { login, googleLogin } from '../states/utenti.js'
import { RouterLink, useRoute } from 'vue-router'
import router from '../router/index.js'

const route = useRoute()

const handleRouteChange = async () => {
	console.log('handleRouteChange called');
	if (route.params.token) {
		dati.value = route.params.token + route.params.loggedId + route.params.loggedUsername + route.params.self;
		console.log('dati:', dati.value);
		setLoggedUser(dati.value);

		// Use nextTick to ensure the state is settled before redirection
		await nextTick();
		router.push('/');
	}
};

//onMounted(handleRouteChange);

watch(
	() => route.query,
	(newQuery, oldQuery) => {
		console.log('route.params changed from', oldQuery, 'to', newQuery);
		handleRouteChange();
	}
);


const dati = ref({
	username: "example_username",
	password: "example_passworD1"
})

const loginGoogle = ref({
	token: route.params.token,
	loggedId: route.params.loggedId,
	loggedUsername: route.params.loggedUsername,
	self: route.params.self
})

async function loginButton() {
	const response = await login(dati.value)
	setLoggedUser(response.data);
	router.push('/');
};


async function googleLoginButton() {
	const response = await googleLogin()
	setLoggedUser(response.data);
	router.push('/');
}

/*async function googleLoginButton() {
	// Any logic you need before redirecting
	
	window.location.href = "http://localhost:5050/api/auth/google";

}*/

onUpdated(() => {
	console.log('Component updated');
	handleRouteChange();
});
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

			<a href="http://localhost:5050/api/auth/google" class="btn btn-danger">
				<span class="fa fa-google"></span> Sign Up with Google
			</a>


		</div>
	</form>
</template>