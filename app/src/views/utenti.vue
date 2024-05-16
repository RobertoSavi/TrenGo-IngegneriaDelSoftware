<script setup>
import { ref, onMounted, watch } from 'vue';
import { loggedUser } from '../states/loggedUser.js';
import { utenti, fetchUtenteUsername } from '../states/utenti.js';
import { useRoute } from 'vue-router';

const route = useRoute();
const username=route.params.username;
const warningMessage = ref('');

onMounted( () => {
	fetchUtenteUsername(username)
});

watch(loggedUser, (_loggedUser, _prevLoggedUser) => {
	warningMessage.value = ''
});
</script>

<template>
	<div class="container" >
		<p v-for="utente in utenti">
			<h1> {{ utente.username }} ({{ utente.karma }})</h1>
		</p>
	</div>
</template>

<style>
@import '@/assets/stileProposta.css';
</style>