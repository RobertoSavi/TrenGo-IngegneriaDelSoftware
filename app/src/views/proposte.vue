<script setup>
import { ref, computed, watch, onBeforeMount, onMounted } from 'vue';
import { loggedUser } from '../states/loggedUser.js';
import { proposte, fetchPropostaId, eliminaProposta } from '../states/proposte.js';
import { RouterLink, useRoute } from 'vue-router';
import { richieste, fetchRichieste, creaRichiesta, gestisciRichiesta } from '../states/richieste.js';

const route = useRoute();
const id=route.params.id;
const warningMessage = ref('');
const HOST_UTENTI="/utenti/";

onBeforeMount( () => {
	fetchPropostaId(id)
});

onMounted( () => {
	if(proposte.value.usernameCreatore==loggedUser.username){
		fetchRichieste(id)
	}
});

watch(loggedUser, (_loggedUser, _prevLoggedUser) => {
	warningMessage.value = ''
});

async function eliminaPropostaButton()
{
	await eliminaProposta(id);
}

async function annullaRichiestaButton(idRichiesta)
{
	//await annullaRichiesta(idRichiesta); for the future
}

async function inviaRichiestaButton()
{
	const dati = ref({'usernameRichiedente': loggedUser.username});
	await creaRichiesta(dati.value, id);
}

async function gestisciRichiestaButton(idRichiesta, acc)
{
	if(acc){
		const dati = ref({'stato': "accettata"});
		await gestisciRichiesta(dati.value, id, idRichiesta);
	}
	else{
		const dati = ref({'stato': "accettata"});
		await gestisciRichiesta(dati.value, id, idRichiesta);
	}	
}

const isRichiedente = computed(() => {
	return false; //for the future
});

const isIscritto = computed(() => {
	try{return proposte.value.partecipanti.includes(loggedUser.username);}
	catch{}
});
</script>

<template>
	<div class="container" v-for="proposta in proposte">	
		<h1>Titolo: {{ proposta.titolo }}</h1>
		<br>
		<label>Username creatore: </label><RouterLink :to="HOST_UTENTI+proposta.usernameCreatore"> {{ proposta.usernameCreatore }} </RouterLink>
		<br>
		<div v-if="proposta.usernameCreatore==loggedUser.username">
			<div v-for="richiesta in richieste">
				<label>Accettare la richiesta di: <RouterLink :to="HOST_UTENTI+richiesta.usernameRichiedente"> {{ richiesta.usernameRichiedente }} </RouterLink>?</label>
				<br>
				<button type="button" @click="gestisciRichiestaButton(proposta.idProposta, true)">Accetta</button>
				<button type="button" @click="gestisciRichiestaButton(proposta.idProposta, false)">Rifiuta</button>
				<br>
			</div>
			<RouterLink :to="'modifica/'+proposta._id" :v-slot="modifica">
				<button :href="modifica">Modifica</button>
			</RouterLink>
			<button @click="eliminaPropostaButton()">Elimina</button>
		</div>
		<button type="button" @click="" v-else-if="isIscritto">Annulla partecipazione</button>
		<button type="button" @click="" v-else-if="isRichiedente">Annulla richiesta</button>
		<button type="button" @click="inviaRichiestaButton()" v-else>Richiedi di partecipare!</button>
	</div>
</template>

<style>
@import '@/assets/stileProposta.css';
</style>