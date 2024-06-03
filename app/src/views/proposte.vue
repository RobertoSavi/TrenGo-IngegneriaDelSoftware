<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { loggedUser } from '../states/loggedUser.js';
import { proposte, fetchPropostaId, eliminaProposta } from '../states/proposte.js';
import { RouterLink, useRoute } from 'vue-router';
import { richieste, fetchRichieste, creaRichiesta, gestisciRichiesta } from '../states/richieste.js';
import router from '../router/index.js'

const route = useRoute();
const id=route.params.id;
const warningMessage = ref('');
const HOST_UTENTI="/utenti/";
const fetchDone=ref(false);

onMounted( async () => {
	await fetchPropostaId(id);
	
	if(proposte.value.proposta.usernameCreatore==loggedUser.username)
	{
		await fetchRichieste(id);
	}
	
	fetchDone.value=true;
});

watch(loggedUser, (_loggedUser, _prevLoggedUser) => {
	warningMessage.value = ''
});

function modifica(propostaId)
{
	router.push('modifica/'+propostaId);
}

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
	
	location.reload;
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
	
	location.reload;
}

var isRichiedente = computed(() => {
	
	/*for(var richiesta in richieste)
	{
		console.log(richiesta.value);
		
		if(richiesta.usernameRichiedente==loggedUser.username)
		{
			return true;
		}
	}*/
	
	return false;
	
});

var isIscritto = computed(() => {
	try{return proposte.value.proposta.partecipanti.includes(loggedUser.username);}
	catch{}
});
</script>

<template>
	<div class="container" v-if="fetchDone" v-for="proposta in proposte">	
		<h1>Titolo: {{ proposta.titolo }}</h1>
		<div>
			<label>Username creatore: </label>
			<RouterLink :to="HOST_UTENTI+proposta.usernameCreatore"> {{ proposta.usernameCreatore }} </RouterLink>
		</div>
		<div v-if="proposta.usernameCreatore==loggedUser.username">
			<div v-for="richiesta in richieste">
				<label>Accettare la richiesta di: </label><RouterLink :to="HOST_UTENTI+richiesta.usernameRichiedente"> {{ richiesta.usernameRichiedente }} </RouterLink>?
				<button type="button" @click="gestisciRichiestaButton(richiesta._id, true)">Accetta</button>
				<button type="button" @click="gestisciRichiestaButton(richiesta._id, false)">Rifiuta</button>
			</div>
			<button @click="modifica(proposta._id)">Modifica</button>
			<button @click="eliminaPropostaButton()">Elimina</button>
		</div>
		<div v-else>
			<button type="button" @click="" v-if="isIscritto">Annulla partecipazione</button>
			<button type="button" @click="" v-else-if="isRichiedente">Annulla richiesta</button>
			<button type="button" @click="inviaRichiestaButton()" v-else>Richiedi di partecipare!</button>
		</div>
	</div>
	<div v-else>Loading...</div>
</template>