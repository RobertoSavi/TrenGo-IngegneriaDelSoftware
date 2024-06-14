<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { chats, messaggi, fetchChatById, fetchMessaggi, postMessaggio } from '../states/chats.mjs'
import { proposte, fetchPropostaId } from '../states/proposte.mjs';
import router from '../router/index.mjs'

const token=localStorage.getItem('token');
const loggedUsername=localStorage.getItem('username');
const route = useRoute();
const idChat = route.params.idChat;
const fetchDone = ref(false);
const contenuto = ref("");
const scrollContainer = ref(null);

onMounted(async () => {
	if (!token) {
		router.push('/');
		return;
	}

	await fetchChatById(idChat);
	await fetchPropostaId(chats.value.idProposta);
	await fetchMessaggi(idChat);

	fetchDone.value = true;
	
	nextTick(() => {
		scroll(); // Scroll to bottom after adding a new message
	});
});

function scroll() {
	const container = scrollContainer.value;
	if (container) {
		const ultimoMessaggio = container.lastElementChild;
		ultimoMessaggio?.scrollIntoView({ behavior: 'instant' });
	}
}

async function postMessaggioKey() {
	
	if (contenuto.value != "") {
		await postMessaggio(idChat, contenuto.value);
	}

	fetchDone.value=false
	contenuto.value = "";
	await fetchMessaggi(idChat);
	fetchDone.value=true;
	
	nextTick(() => {
		scroll(); // Scroll to bottom after adding a new message
	});
}
</script>

<template>
	<div class="chat">
		<div>
			<h2>Chat della proposta {{ proposte.proposta?.titolo }}</h2>
		</div>
		<div class="container-messaggi" ref="scrollContainer">
			<div v-for="messaggio in messaggi" v-if="fetchDone">
				<div v-if="messaggio.senderUsername == loggedUsername" class="messaggio-mio">
					<label>{{ messaggio.senderUsername }}</label>
					<p>{{ messaggio.contenuto }}</p>
					<small>{{ messaggio.data }}</small>
				</div>
				<div v-else class="messaggio">
					<label>{{ messaggio.senderUsername }}</label>
					<p>{{ messaggio.contenuto }}</p>
					<small>{{ messaggio.data }}</small>
				</div>
			</div>
			<div v-else style="height: 5000px;">Loading...</div>
		</div>
		<input type="text" placeholder="Manda un messaggio" v-model="contenuto" @keyup.enter="postMessaggioKey()"/>
	</div>
</template>