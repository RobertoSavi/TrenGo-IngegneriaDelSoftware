<script setup>
import { onMounted, ref, watch } from 'vue';
import { loggedUser } from '../states/loggedUser.js';
import { proposte, modificaProposta, fetchPropostaId } from '../states/proposte.js';
import { useRoute } from 'vue-router';

const route = useRoute();
const id=route.params.id;
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

onMounted( () => {
	fetchPropostaId(id)
	dati.value.titolo=proposte.value.proposta.titolo;
	dati.value.nomeLuogo=proposte.value.proposta.nomeLuogo;
	dati.value.numeroPartecipantiDesiderato=proposte.value.proposta.numeroPartecipantiDesiderato;
	dati.value.descrizione=proposte.value.proposta.descrizione;
	dati.value.data=proposte.value.proposta.data.split('T')[0];
	dati.value.categorie=proposte.value.proposta.categorie;
});

function modificaProposteButton() {
	if (dati.value.titolo==""||dati.value.nomeLuogo==""||dati.value.descrizione==""||dati.value.numeroPartecipantiDesiderato<=1) {
    	warningMessage.value = 'Compilare i campi'
    	return;
	}
	warningMessage.value = ''
  	modificaProposta(dati.value, id).catch( err => console.error(err) );
};

watch(loggedUser, (_loggedUser, _prevLoggedUser) => {
	warningMessage.value = ''
});
</script>

<template>
	<form class="container" v-if="proposte">
		<label for="titolo">Titolo:</label> <input type="text" id="titolo" v-model="dati.titolo" required/>
		<br>
		<label for="luogo">Luogo:</label> <input type="text" id="luogo" v-model="dati.nomeLuogo" required/>
		<br>
		<label for="descrizione">Descrizione:</label> <input type="text" id="descrizione" v-model="dati.descrizione" required/>
		<br>
		<label for="nParecipanti">Numero partecipanti desiderato:</label> <input type="number" id="nPartecipanti" v-model="dati.numeroPartecipantiDesiderato" required/>
		<br>
		<label for="data">Data dell'evento:</label> <input type="date" id="data" v-model="dati.data" required/>
		<br>
		<button type="button" @click="modificaProposteButton()">Fine</button>
		<br>
		<span style="color: red">{{ warningMessage }}</span>
	</form>
</template>