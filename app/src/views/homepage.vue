<script setup>
import { ref, onMounted, watch } from 'vue';
import { loggedUser } from '../states/loggedUser.js';
import { proposte, fetchProposte, fetchProposteNA } from '../states/proposte.js';
import { RouterLink } from 'vue-router'
 
const HOST_PROPOSTA="/proposte/"
const HOST_UTENTI="/utenti/"
const fetchDone=ref(false);

onMounted( async () => {
	if(loggedUser.token)
	{
		await fetchProposte();
	}
	else
	{
		await fetchProposteNA();
	}
	
	console.log(proposte.value);
	
	fetchDone.value=true;
});
</script>

<template>
    <div class="bacheca">
       	<h2 style="height: 5%">Bacheca</h2>
       	<input type="text" class="barraRicerca" placeholder="Cerca proposte...">
       	<div v-if="fetchDone" class="contenitoreProposte">
       		<div class="proposta" v-for="proposta in proposte">
     	 		<h3>
					<RouterLink :to="HOST_PROPOSTA+proposta._id">{{ proposta.titolo }}</RouterLink>
				</h3>
        		<div>
        			<label>Creatore: </label> 
					<RouterLink :to="HOST_UTENTI+proposta.usernameCreatore">{{ proposta.usernameCreatore }}</RouterLink> 
        		</div>
				<div> 
        			<label>Luogo: </label> 
					{{ proposta.nomeLuogo }} 
        		</div>  
				<div>
        			<label>Data e ora: </label> 
					{{ proposta.data.split('.')[0].split('T')[0] }} 
					{{ proposta.data.split('.')[0].split('T')[1] }}
        		</div>
				<div>
					<label>Partecipanti: </label> 
					{{ proposta.numeroPartecipanti }}/{{ proposta.numeroPartecipantiDesiderato }}
        		</div>
				<div>
					<label>Descrizione: </label> {{ proposta.descrizione }}
        		</div>
				<div>
					<label>Categorie: </label>
					<label v-for="categoria in proposta.categorie">
						<span>{{ categoria }}&nbsp;</span>
					</label>
				</div>
        	</div>
        </div>
    	<div v-else>Loading...</div>
    </div>
</template>