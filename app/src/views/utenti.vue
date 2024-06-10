<script setup>
import { ref, computed, onMounted } from 'vue';
import { loggedUser, clearLoggedUser } from '../states/loggedUser.mjs';
import { utenti, fetchUtenteUsername } from '../states/utenti.mjs';
import { follow, unfollow } from '../states/follow.mjs';
import { useRoute } from 'vue-router';
import router from '../router/index.mjs'

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

var isFollower = computed(() => {
	if (utenti.value.utente.followers.includes(loggedUser.username)) {
		return true;
	}

	return false;
});

async function follwButton()
{
	fetchDone.value=false;
	await follow(username);
	await fetchUtenteUsername(username);
	isFollower=true;
	fetchDone.value=true;
}

async function unfollwButton()
{
	fetchDone.value=false;
	await unfollow(username);
	await fetchUtenteUsername(username);
	isFollower=false;
	fetchDone.value=true;
}
</script>

<template>
	<div class="container" v-if="fetchDone" v-for="utente in utenti">
		<h1> {{ utente.username }} ({{ utente.karma }})</h1>
		<h2 v-if="utente.tipoUtente=='grandeOrganizzatore'"> Grande organizzatore </h2>
		<div>
			<label>Nome: </label>{{ utente.nome }}
		</div>
		<div>
			<label>Cognome: </label>{{ utente.cognome }}
		</div>
		<div v-if="utente.username==loggedUser.username">
			<label>Email: </label>{{ utente.email }}
		</div>
		<div>
			<label>Interessi: </label>
			<span v-for="interesse in utente.interessi">{{ interesse+" " }}</span>
		</div>
		<div v-if="utente.username==loggedUser.username">
			<button @click="modifica(loggedUser.id)">Modifica</button>
			<button style="margin-left: 20px;" @click="logout()">Logout</button>
		</div>
		<div v-else-if="isFollower&&loggedUser.token">
			<button @click="unfollwButton()">Smetti di seguire</button>
		</div>
		<div v-else-if="!isFollower&&loggedUser.token">
			<button @click="follwButton()">Segui</button>
		</div>
	</div>
	<div v-else>Loading...</div>
</template>