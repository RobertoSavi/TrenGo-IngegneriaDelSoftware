<script setup>
import { ref, onMounted, watch } from 'vue';
import { loggedUser } from '../states/loggedUser.js';
import { utenti, fetchUtenteUsername } from '../states/utenti.js';
import { useRoute } from 'vue-router';

const route = useRoute();
const username=route.params.username;
const warningMessage = ref('');

onMounted( () => {
	fetchUtenteUsername(username);
	console.log(utenti?.value?.utente);
});

watch(loggedUser, (_loggedUser, _prevLoggedUser) => {
	warningMessage.value = ''
});
</script>

<template>
	<div class="container" v-if="utenti">
		<div v-for="utente in utenti">
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
</template>