<script setup>
import { ref, onMounted } from 'vue';
import { utenti, interessi, fetchUtenteUsername, getInteressi, modificaUtente } from '../states/utenti.mjs'

import { loggedUser } from '../states/loggedUser.mjs'
import router from '../router/index.mjs'

const id=loggedUser.id;
const dati = ref({
	username: "",
	interessi: []
});

var interessiIniziali=[];

const fetchDone=ref(false);

onMounted( async () => {
	await fetchUtenteUsername(loggedUser.username);
	dati.value.username=utenti.value.utente.username;
	dati.value.interessi=utenti.value.utente.interessi;
	
	interessiIniziali=dati.value.interessi;
		
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
	var index = dati.value.interessi.indexOf(interesse);
	
	if(index>-1)
	{
		dati.value.interessi.splice(index, 1);
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
				<input type="checkbox" id="interesse" @click="addInteresse(interesse)" :checked="dati.interessi.includes(interesse)"/>
				{{ interesse }}
			</span>
		</span>
		<div>
			<button type="submit">Fine</button>
		</div>
	</form>
	<div v-else>Loading...</div>
</template>