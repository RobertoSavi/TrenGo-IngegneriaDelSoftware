<script setup>
import { ref, onMounted, watch } from 'vue';
import { loggedUser } from '../states/loggedUser.js';
import { notifiche, fetchNotifiche, setAllAsRead, deleteAll } from '../states/notifiche.js';
import { RouterLink } from 'vue-router'

const HOST_UTENTI = "/utenti/"

onMounted(() => {
	fetchNotifiche();
});
</script>

<template>
	<div class="container">
		<h2 style="float: left">Notifiche</h2>
		<button type="button" id="read" @click="setAllAsRead()">
			<img src="../public/icons/notifiche_read.svg" alt="Segna come lette" class="icon">
		</button>
		<button type="button" id="delt" @click="deleteAll()">
			<img src="../public/icons/notifiche_delete.svg" alt="Elimina tutte" class="icon">
		</button>
	</div>
	<div class="contenitoreProposte">
		<div class="notifica" v-for="notifica in notifiche" :id="notifica.stato">
			<div>
				<label class="labelSorgente">Da:</label>
				<RouterLink v-if="notifica.sorgente !== 'System'" :to="HOST_UTENTI + notifica.sorgente">{{ notifica.sorgente }}</RouterLink>
				<label v-else>System</label>
			</div>
			<label>{{ notifica.messaggio }}</label>
		</div>
	</div>
</template>