<script setup>
import { onMounted, ref, watch } from 'vue';
import { loggedUser } from '../states/loggedUser.js';
import { proposte, modificaProposta, fetchPropostaId } from '../states/proposte.js';
import { useRoute } from 'vue-router';
import router from '../router/index.js'
import { interessi, getInteressi } from '../states/utenti.js'

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
const fetchDone=ref(false);

onMounted( async () => {
	await fetchPropostaId(id)
	dati.value.titolo=proposte.value.proposta.titolo;
	dati.value.nomeLuogo=proposte.value.proposta.nomeLuogo;
	dati.value.numeroPartecipantiDesiderato=proposte.value.proposta.numeroPartecipantiDesiderato;
	dati.value.descrizione=proposte.value.proposta.descrizione;
	dati.value.data=proposte.value.proposta.data.split('.')[0];
	dati.value.categorie=proposte.value.proposta.categorie;
	
	await getInteressi();
	
	fetchDone.value=true;
});

function modificaProposteButton() {
  	modificaProposta(dati.value, id)
	router.back();
};

watch(loggedUser, (_loggedUser, _prevLoggedUser) => {
	warningMessage.value = ''
});
</script>

<template>
	<form v-if="fetchDone" @submit.prevent="submitForm" @submit="modificaProposteButton()">
		<h2>Modifica Proposta:</h2>
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
			<label>Categorie: </label>
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
	<div v-else>Loading...</div>
</template>