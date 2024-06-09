<script setup>
import { ref, onMounted } from 'vue';
import { loggedUser } from '../states/loggedUser.mjs';
import { chats, messaggi, fetchChats, fetchMessaggioById } from '../states/chats.mjs'
import { proposte, fetchPropostaId } from '../states/proposte.mjs';
import router from '../router/index.mjs'

const fetchDone = ref(false);
const titoliProposte = ref([]);
const ultimiMessaggi = ref([]);
const senders = ref([]);
const date = ref([]);

onMounted(async () => {
	if (!loggedUser.token) {
		router.push('/')
	}
	
	await fetchChats();

	for (var index in chats.value)
	{		
		await fetchPropostaId(chats.value[index].idProposta);
		titoliProposte.value.push(proposte.value.proposta.titolo);
			
		if(chats.value[index].messaggi.length!=0)
		{	
			await fetchMessaggioById(chats.value[index]._id, chats.value[index].messaggi[(chats.value[index].messaggi.length)-1]);
			
			console.log(messaggi.value.contenuto);
			
			ultimiMessaggi.value.push(messaggi.value.contenuto);
			senders.value.push(messaggi.value.senderUsername+":");
			date.value.push(messaggi.value.data);
		}
		else
		{
			ultimiMessaggi.value.push("Ancora nessun messaggio");
			senders.value.push("");
			date.value.push("");
		}
	}
	
	fetchDone.value = true;
});

function openChatButton(idChat)
{
	router.push('/chats/'+idChat);
}
</script>

<template>
	<div class="chats-container" v-if="fetchDone">
		<div><h2>Chats:</h2></div>
		<div class="chat-preview" v-for="(chat, index) in chats" @click="openChatButton(chat._id)">
			<h3>{{ titoliProposte[index] }}</h3>
			<div>
				<label>{{ senders[index] }}</label>
				<p>{{ ultimiMessaggi[index] }}</p>
			</div>
			<small>{{ date[index] }}</small>
		</div>
	</div>
	<div v-else>Loading...</div>
</template>

<style>
	@import '@/assets/chats.css';
</style>