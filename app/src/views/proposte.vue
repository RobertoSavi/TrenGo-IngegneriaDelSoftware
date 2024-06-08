<script setup>
import { ref, computed, onMounted } from 'vue';
import { loggedUser } from '../states/loggedUser.mjs';
import { proposte, fetchPropostaId, eliminaProposta } from '../states/proposte.mjs';
import { RouterLink, useRoute } from 'vue-router';
import { richieste, fetchRichieste, creaRichiesta, gestisciRichiesta } from '../states/richieste.mjs';
import router from '../router/index.mjs'

const route = useRoute();
const id = route.params.id;
const HOST_UTENTI = "/utenti/";
const fetchDone = ref(false);

onMounted(async () => {
	
	console.log(id);
	await fetchPropostaId(id);

	await fetchRichieste(id);

	fetchDone.value = true;
});

function modifica(propostaId) {
	router.push('modifica/' + propostaId);
}

async function eliminaPropostaButton() {
	await eliminaProposta(id);
}

async function annullaRichiestaButton(idRichiesta) {
	//await annullaRichiesta(idRichiesta); for the future
}

async function inviaRichiestaButton() {
	const dati = ref({ 'usernameRichiedente': loggedUser.username });
	await creaRichiesta(dati.value, id);

	isRichiedente=true;
}

async function gestisciRichiestaButton(idRichiesta, acc) {
	if (acc) {
		const dati = ref({ stato: "accettata" });
		await gestisciRichiesta(dati.value, id, idRichiesta);
	}
	else {
		const dati = ref({ stato: "rifiutata" });
		await gestisciRichiesta(dati.value, id, idRichiesta);
	}

	router.go(0);
}

var isRichiedente = computed(() => {

	console.log(richieste.value);
	
	if(richieste.value)
	{
		return true;
	}

	return false;

});

var isIscritto = computed(() => {
	return proposte.value.proposta.partecipanti.includes(loggedUser.username); 
});
</script>

<template>
	<div class="container" v-if="fetchDone" v-for="proposta in proposte">
		<h1>Titolo: {{ proposta.titolo }}</h1>
		<div>
			<label>Creatore: </label>
			<RouterLink :to="HOST_UTENTI + proposta.usernameCreatore">{{ proposta.usernameCreatore }}</RouterLink>
		</div>
		<div>
			<label>Luogo: </label>
			{{ proposta.nomeLuogo }}
		</div>
		<div>
			<label>Data e ora: </label>
			{{ proposta.data.split('.')[0].split('T')[0] }}
			{{ proposta.data.split('.')[0].split('T')[1] }}
		</div>
		<div>
			<label>Partecipanti: </label>
			{{ proposta.numeroPartecipanti }}/{{ proposta.numeroPartecipantiDesiderato }}
		</div>
		<div>
			<label>Descrizione: </label>
			{{ proposta.descrizione }}
		</div>
		<div>
			<label>Categorie: </label>
			<label v-for="categoria in proposta.categorie">
				<span>{{ categoria }}&nbsp;</span>
			</label>
		</div>
		<div v-if="proposta.usernameCreatore == loggedUser.username">
			<div v-for="richiesta in richieste">
				<label>Accettare la richiesta di: </label>
				<RouterLink :to="HOST_UTENTI + richiesta.usernameRichiedente"> {{ richiesta.usernameRichiedente }}
				</RouterLink>?
				<button type="button" @click="gestisciRichiestaButton(richiesta._id, true)">Accetta</button>
				<button type="button" @click="gestisciRichiestaButton(richiesta._id, false)">Rifiuta</button>
			</div>
			<div>
				<button @click="modifica(proposta._id)">Modifica</button>
				<button style="margin-left: 20px;" @click="eliminaPropostaButton()">Elimina</button>
			</div>
		</div>
		<div v-else>
			<button type="button" @click="" v-if="isIscritto">Annulla partecipazione</button>
			<button type="button" @click="" v-else-if="isRichiedente">Annulla richiesta</button>
			<button type="button" @click="inviaRichiestaButton()" v-else>Richiedi di partecipare!</button>
		</div>
	</div>
	<div v-else>Loading...</div>
</template>