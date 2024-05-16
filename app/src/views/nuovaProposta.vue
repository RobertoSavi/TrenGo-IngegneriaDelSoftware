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
    	warningMessage.value = 'Inserire i campi'
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
	<form class="container">
		<label for="titolo">Titolo:</label> <input type="text" id="titolo" v-model="dati.titolo"/>
		<br>
		<label for="luogo">Luogo:</label> <input type="text" id="luogo" v-model="dati.nomeLuogo"/>
		<br>
		<label for="descrizione">Descrizione:</label> <input type="text" id="descrizione" v-model="dati.descrizione"/>
		<br>
		<label for="nParecipanti">Numero partecipanti desiderato:</label> <input type="number" id="nPartecipanti" v-model="dati.numeroPartecipantiDesiderato"/>
		<br>
		<label for="data">Data dell'evento:</label> <input type="date" id="data" v-model="dati.data"/>
		<br>
		<button type="button" @click="creaProposteButton()">Fine</button>
		
		<span>{{ warningMessage }}</span>
	</form>
</template>

<style>
@import '@/assets/stileProposta.css';
</style>