<script setup>
import { ref, onMounted } from 'vue';
import { errori, utenti, interessi, fetchUtenteUsername, getInteressi, modificaUtente } from '../states/utenti.mjs'
import router from '../router/index.mjs'

const token=localStorage.getItem('token');
const loggedUsername=localStorage.getItem('username')
const loggedId=localStorage.getItem('id');
const dati = ref({
	username: "",
	interessi: []
});
const erroreSuccesso = ref(false)
const fetchDone=ref(false);

onMounted( async () => {
	if (token==null) {
		router.push('/');
		return;
	}
	
	await fetchUtenteUsername(loggedUsername);
	dati.value.username=utenti.value.utente.username;
	dati.value.interessi=utenti.value.utente.interessi;
		
	await getInteressi();
	
	fetchDone.value="true";
});

async function modificaButton() {	
	erroreSuccesso.value = false;
	errori.value = [];
	
	await modificaUtente(dati.value, loggedId);
	
	if (errori.value.length == 0) {
		localStorage.setItem('username', dati.value.username);
		router.push('/utenti/'+localStorage.getItem('username'));
	}
	else {
		erroreSuccesso.value = true;
	}
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
		<div class="alert" v-if="erroreSuccesso">
			<span class="closebtn" @click="erroreSuccesso = false">&times;</span>
			<p>Qualcosa è andato storto:</p>
			<p v-for="errore in errori">{{ errore.message }}</p>
		</div>
		<div>
			<button type="submit">Fine</button>
		</div>
	</form>
	<div v-else>Loading...</div>
</template>