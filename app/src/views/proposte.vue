<script setup>
import { ref, computed, onMounted } from 'vue';
import { loggedUser } from '../states/loggedUser.mjs';
import { proposte, fetchPropostaId, eliminaProposta, annullaPartecipazione } from '../states/proposte.mjs';
import { RouterLink, useRoute } from 'vue-router';
import { richieste, fetchRichieste, creaRichiesta, gestisciRichiesta, annullaRichiesta } from '../states/richieste.mjs';
import router from '../router/index.mjs'

const route = useRoute();
const id = route.params.id;
const HOST_UTENTI = "/utenti/";
const fetchDone = ref(false);

onMounted(async () => {
	await fetchPropostaId(id);

	await fetchRichieste(id);

	fetchDone.value = true;
});

function modifica(propostaId) {
	router.push('modifica/' + propostaId);
}

async function eliminaPropostaButton() {
	await eliminaProposta(id);

	router.push('/');
}

async function inviaRichiestaButton() {
	const dati = ref({ 'usernameRichiedente': loggedUser.username });
	await creaRichiesta(dati.value, id);

	fetchDone.value = false;
	await fetchRichieste(id);
	fetchDone.value = true;
}

async function annullaRichiestaButton(idRichiesta) {
	await annullaRichiesta(id, idRichiesta);

	fetchDone.value = false;
	await fetchRichieste(id);
	fetchDone.value = true;
}

async function annullaPartecipazioneButton() {
	await annullaPartecipazione(id);

	fetchDone.value = false;
	await fetchPropostaId(id);
	fetchDone.value = true;
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

	fetchDone.value = false;
	await fetchRichieste(id);
	await fetchPropostaId(id);
	fetchDone.value = true;
}

var isRichiedente = computed(() => {
	for (var index in richieste.value) {
		if (richieste.value[index].usernameRichiedente == loggedUser.username) {
			return true;
		}
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
		<div class="partecipanti">
					<div class="contenitoreHeader">
						<h2>Partecipanti:</h2>
					</div>
					<div v-if="proposta.partecipanti.length==0">Ancora nessun partecipante</div>
					<ul v-else>
						<li v-for="partecipante in proposta.partecipanti">
							<div class="contenitorePartecipante">
								<div>{{ partecipante }}</div>
							</div>
						</li>
					</ul>
				</div>
		<div v-if="proposta.usernameCreatore == loggedUser.username && loggedUser.username">
			<div v-for="richiesta in richieste">
				<label>Accettare la richiesta di: </label>
				<RouterLink :to="HOST_UTENTI + richiesta.usernameRichiedente"> {{ richiesta.usernameRichiedente }}
				</RouterLink>?
				<button type="button" style="margin-right: 10px;" @click="gestisciRichiestaButton(richiesta._id, true)">Accetta</button>
				<button type="button" @click="gestisciRichiestaButton(richiesta._id, false)">Rifiuta</button>
			</div>
			<div>
				<button @click="modifica(proposta._id)">Modifica</button>
				<button style="margin-left: 20px;" @click="eliminaPropostaButton()">Elimina</button>
			</div>
		</div>
		<div v-else-if="proposta.usernameCreatore != loggedUser.username && loggedUser.username">
			<button type="button" @click="annullaPartecipazioneButton()" v-if="isIscritto">Annulla
				partecipazione</button>
			<button v-for="richiesta in richieste" type="button" @click="annullaRichiestaButton(richiesta._id)"
				v-else-if="isRichiedente">Annulla richiesta</button>
			<button type="button" @click="inviaRichiestaButton()" v-else>Richiedi di partecipare!</button>
		</div>
	</div>
	<div v-else>Loading...</div>
</template>