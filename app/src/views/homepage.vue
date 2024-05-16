<script setup>
import { ref, onMounted, watch } from 'vue';
import { loggedUser } from '../states/loggedUser.js';
import { proposte, fetchProposte } from '../states/proposte.js';
import { RouterLink } from 'vue-router'

const HOST_PROPOSTA="/proposte/"
const HOST_UTENTI="/utenti/"
const warningMessage = ref('');

onMounted( () => {
  fetchProposte() // fetch on init
});

watch(loggedUser, (_loggedUser, _prevLoggedUser) => {
  warningMessage.value = ''
});
</script>

<template>
    <div class="bacheca">
       	<h2 style="height: 5%">Bacheca</h2>
       	<input type="text" class="barraRicerca" placeholder="Cerca proposte...">
       	<div class="contenitoreProposte">
       		<div class="proposta" v-for="proposta in proposte">
     	 		<h3><RouterLink :to="HOST_PROPOSTA+proposta._id">{{ proposta.titolo }}</RouterLink></h3>
        		<br>
        		<p><strong>Creatore:</strong> <RouterLink :to="HOST_UTENTI+proposta.usernameCreatore">{{ proposta.usernameCreatore }}</RouterLink> 
        		<br> 
        		<strong>Luogo:</strong> {{ proposta.nomeLuogo }} 
        		<br>  
        		<strong>Data:</strong> {{ proposta.data }} </p>
        		<br>
        		<p><strong>Descrizione:</strong> {{ proposta.descrizione }}</p>
        		<br>
        		<p v-for="categoria in proposta.categorie">{{ categoria }}</p>
        	</div>
        </div>
    </div>
</template>

<style>
@import '@/assets/stileHomepage.css';
</style>