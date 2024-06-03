<script setup>
import { ref, onMounted } from 'vue';
import { utenti, interessi, fetchUtenteUsername, getInteressi, modificaUtente } from '../states/utenti.js'
import { useRoute } from 'vue-router';
import { loggedUser } from '../states/loggedUser.js'
import router from '../router/index.js'

const id=loggedUser.id;
const dati = ref({
	username: "",
	interessi: []
});
const fetchDone=ref(false);

onMounted( async () => {
	await fetchUtenteUsername(loggedUser.username);
	dati.value.username=utenti.value.utente.username;
	dati.value.interessi=utenti.value.utente.interessi;
	
	await getInteressi();
	
	fetchDone.value="true";
});

async function modificaButton() {
	await modificaUtente(dati.value, id);
	loggedUser.username=dati.value.username;
	router.back();
}

function addInteresse(interesse)
{
	if(dati.value.interessi.includes(interesse))
	{
		dati.value.interessi.pop(interesse);
	}
	else
	{
		dati.value.interessi.push(interesse);
	}
}
</script>

<template>
	<form v-if="fetchDone" @submit.prevent="submitForm" @submit="modificaButton()">
		<h2>Modifica account</h2>
		<div>
			<label>Username:</label>
			<input type="text" v-model="dati.username" required />
		</div>
		<div>
			<label>Interessi:</label>
		</div>
		<span class="contenitoreInteressi">
			<span class="interesse" v-for="interesse in interessi">
				<input type="checkbox" @click="addInteresse(interesse)" :checked="dati.interessi.includes(interesse)"/>
				{{ interesse }}
			</span>
		</span>
		<div>
			<button type="submit">Modifica</button>
		</div>
	</form>
	<div v-else>Loading...</div>v
</template>