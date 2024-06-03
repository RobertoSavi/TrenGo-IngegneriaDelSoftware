<script setup>
import { ref, onMounted, watch } from 'vue';
import { loggedUser } from '../states/loggedUser.js';
import { utenti, interessi, fetchUtenteUsername, getInteressi } from '../states/utenti.js';
import { useRoute } from 'vue-router';

const route = useRoute();
const username=route.params.username;
const warningMessage = ref('');
const fetchDone=ref(false);

onMounted( async () => {
	await fetchUtenteUsername(username);
	await getInteressi();
	fetchDone.value=true;
});

watch(loggedUser, (_loggedUser, _prevLoggedUser) => {
	warningMessage.value = ''
});
</script>

<template>
	<div class="page" v-if="fetchDone">
		<div class="container" v-for="utente in utenti">
			<h1> {{ utente.username }} ({{ utente.karma }})</h1>
			<h2 v-if="utente.tipoUtente=='grandeOrganizzatore'"> Grande organizzatore </h2>
			<br>
			<label>Nome: </label>{{ loggedUser.nome }}
			<br>
			<label>Cognome: </label>{{ utente.cognome }}
			<br>
			<label>Interessi: </label>
			<span v-for="interesse in utente.interessi">{{ interesse+", " }}</span>
			<div v-if="utente.username==loggedUser.username">
				<label>Email: </label>{{ utente.email }}
				<br>
				<button>Modifica</button>
			</div>
			<div v-else>
				<button>Segui</button>
			</div>
		</div>
	</div>
	<div v-else>Loading...</div>
</template>