<script setup>
import { ref, onMounted, watch } from 'vue';
import { loggedUser } from '../states/loggedUser.mjs';
import { proposte, proposteIscritto, proposteTerminate, fetchProposteMie, fetchProposteIscritto, fetchProposteTerminate } from '../states/proposte.mjs';
import { RouterLink } from 'vue-router'
import router from '../router/index.mjs'

const HOST_PROPOSTA = "/proposte/"
const HOST_UTENTI = "/utenti/"
const HOST_VALUTAZIONI = "/valutazioni/"
const warningMessage = ref('');

onMounted(() => {
	if (!loggedUser.token) {
		router.push('/');
		return;
	}

	fetchProposteMie()
	fetchProposteIscritto()
	fetchProposteTerminate()
});

watch(loggedUser, (_loggedUser, _prevLoggedUser) => {
	warningMessage.value = ''
});
</script>

<template>
	<div class="bacheca">
		<h2 style="height: 5%">Proposte create</h2>
		<div class="contenitoreProposte">
			<div class="proposta" v-for="proposta in proposte">
				<h3>
					<RouterLink :to="HOST_PROPOSTA + proposta._id">{{ proposta.titolo }}</RouterLink>
				</h3>
				<br>
				<p><label>Creatore: </label>
					<RouterLink :to="HOST_UTENTI + proposta.usernameCreatore">{{ proposta.usernameCreatore }}
					</RouterLink>
					<br>
					<label>Luogo: </label> {{ proposta.nomeLuogo }}
					<br>
					<label>Data: </label> {{ proposta.data }}
				</p>
				<br>
				<p><label>Descrizione:</label> {{ proposta.descrizione }}</p>
				<br>
				<p v-for="categoria in proposta.categorie">{{ categoria }}</p>
				<div class="partecipanti">
					<div class="contenitoreHeader">
						<h2>Partecipanti:</h2>
					</div>
					<div v-if="proposta.partecipanti.length == 0">Ancora nessun partecipante</div>
					<ul v-else>
						<li v-for="partecipante in proposta.partecipanti">
							<div class="contenitorePartecipante">
								<div>{{ partecipante }}</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
	<div class="bacheca">
		<h2 style="height: 5%">Proposte alle quali partecipo</h2>
		<div class="contenitoreProposte">
			<div class="proposta" v-for="proposta in proposteIscritto">
				<h3>
					<RouterLink :to="HOST_PROPOSTA + proposta._id">{{ proposta.titolo }}</RouterLink>
				</h3>
				<br>
				<p><label>Creatore: </label>
					<RouterLink :to="HOST_UTENTI + proposta.usernameCreatore">{{ proposta.usernameCreatore }}
					</RouterLink>
					<br>
					<label>Luogo: </label> {{ proposta.nomeLuogo }}
					<br>
					<label>Data: </label> {{ proposta.data }}
				</p>
				<br>
				<p><label>Descrizione:</label> {{ proposta.descrizione }}</p>
				<br>
				<p v-for="categoria in proposta.categorie">{{ categoria }}</p>
				<div class="partecipanti">
					<div class="contenitoreHeader">
						<h2>Partecipanti:</h2>
					</div>
					<div v-if="proposta.partecipanti.length == 0">Ancora nessun partecipante</div>
					<ul v-else>
						<li v-for="partecipante in proposta.partecipanti">
							<div class="contenitorePartecipante">
								<div>{{ partecipante }}</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
	<div class="bacheca">
		<h2 style="height: 5%">Proposte terminate</h2>
		<div class="contenitoreProposte">
			<div class="proposta" v-for="proposta in proposteTerminate">
				<h3>
					<RouterLink :to="HOST_VALUTAZIONI + proposta._id">{{ proposta.titolo }}</RouterLink>
				</h3>
				<br>
				<p><label>Creatore: </label>
					<RouterLink :to="HOST_UTENTI + proposta.usernameCreatore">{{ proposta.usernameCreatore }}
					</RouterLink>
					<br>
					<label>Luogo: </label> {{ proposta.nomeLuogo }}
					<br>
					<label>Data: </label> {{ proposta.data }}
				</p>
				<br>
				<p><label>Descrizione:</label> {{ proposta.descrizione }}</p>
				<br>
				<p v-for="categoria in proposta.categorie">{{ categoria }}</p>
				<div class="partecipanti">
					<div class="contenitoreHeader">
						<h2>Partecipanti:</h2>
					</div>
					<div v-if="proposta.partecipanti.length == 0">Ancora nessun partecipante</div>
					<ul v-else>
						<li v-for="partecipante in proposta.partecipanti">
							<div class="contenitorePartecipante">
								<div>{{ partecipante }}</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</div>
	</div>
</template>