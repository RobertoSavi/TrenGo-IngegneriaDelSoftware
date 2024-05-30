<script setup>
import { ref, onMounted, watch } from 'vue';
import { loggedUser } from '../states/loggedUser.js';
import { proposte, fetchProposte, fetchProposteNA } from '../states/proposte.js';
import { RouterLink } from 'vue-router'
 
const HOST_PROPOSTA="/proposte/"
const HOST_UTENTI="/utenti/"
const warningMessage = ref('');

onMounted( () => {
	if(loggedUser.token){
		fetchProposte()
	}
	else{
		fetchProposteNA()
	}
});

watch(loggedUser, (_loggedUser, _prevLoggedUser) => {
	warningMessage.value = ''
});
</script>

<template>
    <div class="bacheca">
       	<h2 style="height: 5%">Bacheca</h2>
       	<input type="text" class="barraRicerca" placeholder="Cerca proposte...">
       	<div v-if="proposte" class="contenitoreProposte">
       		<div class="proposta" v-for="proposta in proposte">
     	 		<h3><RouterLink :to="HOST_PROPOSTA+proposta._id">{{ proposta.titolo }}</RouterLink></h3>
        		<br>
        		<p><label>Creatore: </label> <RouterLink :to="HOST_UTENTI+proposta.usernameCreatore">{{ proposta.usernameCreatore }}</RouterLink> 
        		<br> 
        		<label>Luogo: </label> {{ proposta.nomeLuogo }} 
        		<br>  
        		<label>Data: </label> {{ proposta.data }} 
        		<br>
				<label>Partecipanti: </label> {{ proposta.numeroPartecipanti }} / {{ proposta.numeroPartecipantiDesiderato }} </p>
        		<p><label>Descrizione:</label> {{ proposta.descrizione }}</p>
        		<br>
        		<p v-for="categoria in proposta.categorie">{{ categoria }}</p>
        	</div>
        </div>
    <div v-else><strong>Loading...</strong></div>
    </div>
</template>

<style>
@import '@/assets/stileHomepage.css';
</style>