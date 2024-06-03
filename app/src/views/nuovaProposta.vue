<script setup>
import { ref, watch } from 'vue';
import { loggedUser } from '../states/loggedUser.js';
import { creaProposta } from '../states/proposte.js';

const warningMessage = ref('');
const dati = ref({
	usernameCreatore: loggedUser.username,
	creatore: loggedUser.id,
	titolo: "",
	nomeLuogo: "",
	numeroPartecipantiDesiderato: "",
	descrizione: "",
	data: "",
	categorie: ["Altro"]
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

watch(loggedUser, (_loggedUser, _prevLoggedUser) => {
	warningMessage.value = ''
});
</script>

<template>
	<form class="container-flex" @submit.prevent="submitForm" @submit="creaProposteButton()">
		<h2>Nuova Proposta:</h2>
		<div>
			<label for="titolo">Titolo:</label> 
			<input type="text" id="titolo" v-model="dati.titolo" required />
		</div>
		<div>
			<label for="luogo">Luogo:</label> 
			<input type="text" id="luogo" v-model="dati.nomeLuogo" required />
		</div>
		<div>
			<label for="descrizione">Descrizione:</label> 
			<input type="text" id="descrizione" v-model="dati.descrizione" required />
		</div>
		<div>
			<label for="nParecipanti">Numero partecipanti desiderato:</label> 
			<input type="number" id="nPartecipanti" v-model="dati.numeroPartecipantiDesiderato" required />
		</div>
		<div>
			<label for="data">Data dell'evento:</label> 
			<input type="datetime-local" id="data" v-model="dati.data" required />
		</div>
		<div>
			<button type="submit">Fine</button>
		</div>
		<span style="color: red">{{ warningMessage }}</span>
	</form>
</template>