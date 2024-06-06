<script setup>
import { onMounted, ref, watch, reactive } from 'vue';
import { loggedUser } from '../states/loggedUser.mjs';
import { proposte, fetchPropostaIdValutazioni } from '../states/proposte.mjs';
import { valutaPartecipantiByIdProposta, valutaPartecipanteByUsername } from '../states/valutazioni.mjs';
import { useRoute } from 'vue-router';
import router from '../router/index.mjs'
import upvoteBlack from '../public/icons/valutazioni_upvote_black.svg';
import upvote from '../public/icons/valutazioni_upvote.svg';
import downvoteBlack from '../public/icons/valutazioni_downvote_black.svg';
import downvote from '../public/icons/valutazioni_downvote.svg';

const route = useRoute();
const id = route.params.idProposta;
const warningMessage = ref('');
const fetchDone = ref(false);
const hover = ref({ upvote: false, downvote: false });
const hoverPartecipante = reactive([]);
const HOST_UTENTI = "/utenti/"

onMounted(async () => {
	try {
		await fetchPropostaIdValutazioni(id);
		if (proposte.value.proposta) {
			for (let i = 0; i < proposte.value.proposta.partecipanti.length; i++) {
				hoverPartecipante[i] = { upvote: false, downvote: false };
			}
		}
		fetchDone.value = true;
	} catch (error) {
		console.error('Error fetching proposta id valutazioni:', error);
	}
});

async function valutaPartecipanteByIdPropostaButton(idProposta, valutazione) {
	await valutaPartecipantiByIdProposta(idProposta, valutazione);
	fetchDone.value = false;
	await fetchPropostaIdValutazioni(id);
	fetchDone.value = true;
}

async function valutaPartecipanteByUsernameButton(idProposta, username, valutazione) {
	await valutaPartecipanteByUsername(idProposta, username, valutazione);
	fetchDone.value = false;
	await fetchPropostaIdValutazioni(id);
	fetchDone.value = true;
}

watch(loggedUser, (_loggedUser, _prevLoggedUser) => {
	warningMessage.value = ''
});

</script>

<template>
	<div class="proposta" v-if="fetchDone" v-for="proposta in proposte">
		<h1 class="feature">Valuta partecipanti</h1>
		<h2>Titolo: {{ proposta.titolo }}</h2>
		<br>
		<div class="campo">
			<label class="campo">Username creatore: </label>
			<RouterLink :to="HOST_UTENTI + proposta.usernameCreatore"> {{ proposta.usernameCreatore }} </RouterLink>
		</div>
		<br>
		<div class="campo">
			<label for="luogo" class="campo">Luogo:</label>
			<div>{{ proposta.nomeLuogo }}</div>
		</div>
		<div class="campo">
			<label for="descrizione" class="campo">Descrizione:</label>
			<div>{{ proposta.descrizione }}</div>
		</div>
		<div class="campo">
			<label for="nParecipanti" class="campo">Numero partecipanti desiderato:</label>
			<div>{{ proposta.numeroPartecipantiDesiderato }}</div>
		</div>
		<div class="campo">
			<label for="data" class="campo">Data dell'evento:</label>
			<div>{{ proposta.data }}</div>
		</div>
		<span style="color: red">{{ warningMessage }}</span>

		<div class="partecipanti">
			<div class="contenitoreHeader valutazioni">
				<h2>Partecipanti:</h2>
				<div class="contenitoreIcone" v-if="proposta.utentiValutabili>0">
					<button type="button" class="vote" @click="valutaPartecipanteByIdPropostaButton(proposta._id, +1)"
						@mouseover="hover.upvote = true" @mouseleave="hover.upvote = false">
						<img :src="hover.upvote ? upvoteBlack : upvote" alt="Valuta positivamente" class="icon">
					</button>
					<button type="button" class="vote" @click="valutaPartecipanteByIdPropostaButton(proposta._id, -1)"
						@mouseover="hover.downvote = true" @mouseleave="hover.downvote = false">
						<img :src="hover.downvote ? downvoteBlack : downvote" alt="Valuta negativamente" class="icon">
					</button>
				</div>
			</div>
			<ul>
				<li v-for="(partecipante, index) in proposta.partecipanti">
					<div class="contenitorePartecipante">
						<div>{{ partecipante[0] }}</div>
						<div class="contenitoreIcone" v-if="!partecipante[1]">
							<button type="button" class="vote"
								@click="valutaPartecipanteByUsernameButton(proposta._id, partecipante[0], +1)"
								@mouseover="hoverPartecipante[index].upvote = true"
								@mouseleave="hoverPartecipante[index].upvote = false">
								<img :src="hoverPartecipante[index].upvote ? upvoteBlack : upvote"
									alt="Valuta positivamente" class="icon" :key="hoverPartecipante[index].upvote">
							</button>
							<button type="button" class="vote"
								@click="valutaPartecipanteByUsernameButton(proposta._id, partecipante[0], -1)"
								@mouseover="hoverPartecipante[index].downvote = true"
								@mouseleave="hoverPartecipante[index].downvote = false">
								<img :src="hoverPartecipante[index].downvote ? downvoteBlack : downvote"
									alt="Valuta negativamente" class="icon" :key="hoverPartecipante[index].downvote">
							</button>
						</div>
					</div>
				</li>
			</ul>
		</div>
	</div>
	<div v-else>Loading...</div>


</template>