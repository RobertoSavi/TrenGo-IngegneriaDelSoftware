<script setup>
import { ref, onBeforeMount, computed, watch, onMounted } from 'vue';
import { loggedUser } from '../states/loggedUser.js';
import { proposte, fetchPropostaId } from '../states/proposte.js';
import { useRoute } from 'vue-router';

const route = useRoute();
const id=route.params.id;
const warningMessage = ref('');
const HOST_UTENTI="/utenti/";

onMounted( () => {
	fetchPropostaId(id);
});

watch(loggedUser, (_loggedUser, _prevLoggedUser) => {
	warningMessage.value = ''
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
		<label>Username creatore: </label>{{ proposta.usernameCreatore }}
		<br>
		<button type="button" @click="" v-if="proposta.usernameCreatore==loggedUser.username">Modifica</button>
		<button type="button" @click="" v-else-if="isIscritto">Disicriviti</button>
		<button type="button" @click="" v-else>Iscriviti</button>
	</div>
</template>

<style>
@import '@/assets/stileProposta.css';
</style>