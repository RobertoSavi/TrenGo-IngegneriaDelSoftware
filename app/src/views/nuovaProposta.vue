<script setup>
import { ref, onMounted } from 'vue';
import { loggedUser } from '../states/loggedUser.js';
import { creaProposta } from '../states/proposte.js';
import { interessi, getInteressi } from '../states/utenti.js'

const dati = ref({
	usernameCreatore: loggedUser.username,
	creatore: loggedUser.id,
	titolo: "",
	nomeLuogo: "",
	numeroPartecipantiDesiderato: "",
	descrizione: "",
	data: "",
	categorie: []
});

onMounted(() => {
	getInteressi();
});

function creaProposteButton() {
	if (dati.value.titolo==""||dati.value.nomeLuogo==""||dati.value.descrizione==""||dati.value.numeroPartecipantiDesiderato<=1) {
    	warningMessage.value = 'Compilare i campi'
    	return;
	}
	const datiJson = JSON.stringify(dati.value);
	warningMessage.value = ''
  	creaProposta(datiJson).catch( err => console.error(err) );
};

function addCategoria(categoria)
{
	if(dati.value.interessi.includes(categoria))
	{
		dati.value.interessi.pop(categoria);
	}
	else
	{
		dati.value.interessi.push(categoria);
	}
}
</script>

<template>
	<form @submit.prevent="submitForm" @submit="creaProposteButton()">
		<h2>Nuova Proposta:</h2>
		<div>
			<label for="titolo">Titolo:</label> 
			<input type="text" v-model="dati.titolo" required />
		</div>
		<div>
			<label for="luogo">Luogo:</label> 
			<input type="text" v-model="dati.nomeLuogo" required />
		</div>
		<div>
			<label for="descrizione">Descrizione:</label> 
			<input type="text" v-model="dati.descrizione" required />
		</div>
		<div>
			<label for="nParecipanti">Numero partecipanti desiderato:</label> 
			<input type="number" v-model="dati.numeroPartecipantiDesiderato" required />
		</div>
		<div>
			<label for="data">Data dell'evento:</label> 
			<input type="datetime-local" v-model="dati.data" required />
		</div>
		<div>
			<label>Categorie:</label>
		</div>	
		<span class="contenitoreInteressi">
			<span class="interesse" v-for="interesse in interessi">
				<input type="checkbox" @click="addCategoria(interesse)"/>
				{{ interesse }}
			</span>
		</span>
		<div>
			<button type="submit">Fine</button>
		</div>
	</form>
</template>