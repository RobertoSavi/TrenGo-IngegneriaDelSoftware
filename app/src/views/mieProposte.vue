<script setup>
import { ref, onMounted, watch } from 'vue';
import { loggedUser } from '../states/loggedUser.js';
import { proposte, proposteIscritto, fetchProposteMie, fetchProposteIscritto } from '../states/proposte.js';
import { RouterLink } from 'vue-router'

const HOST_PROPOSTA="/proposte/"
const HOST_UTENTI="/utenti/"
const warningMessage = ref('');

onMounted( () => {
	fetchProposteMie()
	fetchProposteIscritto()
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
     	 		<h3><RouterLink :to="HOST_PROPOSTA+proposta._id">{{ proposta.titolo }}</RouterLink></h3>
        		<br>
        		<p><label>Creatore: </label> <RouterLink :to="HOST_UTENTI+proposta.usernameCreatore">{{ proposta.usernameCreatore }}</RouterLink> 
        		<br> 
        		<label>Luogo: </label> {{ proposta.nomeLuogo }} 
        		<br>  
        		<label>Data: </label> {{ proposta.data }} </p>
        		<br>
        		<p><label>Descrizione:</label> {{ proposta.descrizione }}</p>
        		<br>
        		<p v-for="categoria in proposta.categorie">{{ categoria }}</p>
        	</div>
        </div>
    </div>
	<div class="bacheca">
	       	<h2 style="height: 5%">Proposte alle quali partecipo</h2>
	       	<div class="contenitoreProposte">
	       		<div class="proposta" v-for="proposta in proposteIscritto">
	     	 		<h3><RouterLink :to="HOST_PROPOSTA+proposta._id">{{ proposta.titolo }}</RouterLink></h3>
	        		<br>
	        		<p><label>Creatore: </label> <RouterLink :to="HOST_UTENTI+proposta.usernameCreatore">{{ proposta.usernameCreatore }}</RouterLink> 
	        		<br> 
	        		<label>Luogo: </label> {{ proposta.nomeLuogo }} 
	        		<br>  
	        		<label>Data: </label> {{ proposta.data }} </p>
	        		<br>
	        		<p><label>Descrizione:</label> {{ proposta.descrizione }}</p>
	        		<br>
	        		<p v-for="categoria in proposta.categorie">{{ categoria }}</p>
	        	</div>
	        </div>
	    </div>
</template>