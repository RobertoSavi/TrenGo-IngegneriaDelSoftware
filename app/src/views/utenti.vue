<script setup>
import { ref, onMounted } from 'vue';
import { loggedUser, clearLoggedUser } from '../states/loggedUser.js';
import { utenti, fetchUtenteUsername } from '../states/utenti.js';
import { useRoute } from 'vue-router';
import router from '../router/index.js'

const route = useRoute();
const username=route.params.username;
const fetchDone=ref(false);

onMounted( async () => {
	await fetchUtenteUsername(username);
	fetchDone.value=true;
});

function modifica()
{
	router.push('modifica');
}

function logout()
{
	clearLoggedUser();
	router.push('/');
}
</script>

<template>
	<div class="container" v-if="fetchDone" v-for="utente in utenti">
		<h1> {{ utente.username }} ({{ utente.karma }})</h1>
		<h2 v-if="utente.tipoUtente=='grandeOrganizzatore'"> Grande organizzatore </h2>
		<div>
			<label>Nome: </label>{{ loggedUser.nome }}
		</div>
			<label>Cognome: </label>{{ utente.cognome }}
		<div v-if="utente.username==loggedUser.username">
			<label>Email: </label>{{ utente.email }}
		</div>
		<div>
			<label>Interessi: </label>
			<span v-for="interesse in utente.interessi">{{ interesse+", " }}</span>
		</div>
		<div v-if="utente.username==loggedUser.username">
			<button @click="modifica(loggedUser.id)">Modifica</button>
			<button style="margin-left: 20px;" @click="logout()">Logout</button>
		</div>
		<div v-else>
			<button>Segui</button>
		</div>
	</div>
	<div v-else>Loading...</div>
</template>