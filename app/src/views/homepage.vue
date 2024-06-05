<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { loggedUser } from '../states/loggedUser.js';
import { proposte, fetchProposte, fetchProposteNA } from '../states/proposte.js';
import { RouterLink } from 'vue-router'
import L from 'leaflet'

const leafletMap=ref(); 
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
	
	fetchDone.value=true;
	
	nextTick(() => {
		initLeafletMap()
	})
});

function initLeafletMap()
{
	leafletMap.value = L.map('mappa', {center: new L.LatLng(46.0677, 11.1215), zoom: 12});
	
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19}).addTo(leafletMap.value);
	
	proposte.value.forEach(loc =>
	{
		if(loc.coordinate.length==2)
		{	
			const marker = L.marker([loc.coordinate[0], loc.coordinate[1]]).addTo(leafletMap.value)
		}
	});
}

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
	<div id="mappa" class="container-mappa"></div>
</template>