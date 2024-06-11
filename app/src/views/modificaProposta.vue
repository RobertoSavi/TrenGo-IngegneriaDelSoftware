<script setup>
import { onMounted, ref, nextTick } from 'vue';
import { errori, proposte, modificaProposta, fetchPropostaId } from '../states/proposte.mjs';
import { useRoute } from 'vue-router';
import { interessi, getInteressi } from '../states/utenti.mjs'
import L from 'leaflet'
import router from '../router/index.mjs'

const token=localStorage.getItem('token');
const loggedUsername=localStorage.getItem('username')
const loggedId=localStorage.getItem('id');
const luogoValido = ref(true);
const leafletMap = ref();
const marker = ref();
const route = useRoute();
const id=route.params.id;
const dati = ref({
	usernameCreatore: loggedUsername,
	creatore: loggedId,
	titolo: "",
	nomeLuogo: "",
	coordinate: [],
	numeroPartecipantiDesiderato: "",
	descrizione: "",
	data: "",
	categorie: []
});
const fetchDone=ref(false);
const erroreSuccesso = ref(false)

onMounted( async () => {
	if (token==null) {
		router.push('/');
		return;
	}
	
	await fetchPropostaId(id)
	
	dati.value.titolo=proposte.value.proposta.titolo;
	dati.value.nomeLuogo=proposte.value.proposta.nomeLuogo;
	dati.value.coordinate=proposte.value.proposta.coordinate;
	dati.value.numeroPartecipantiDesiderato=proposte.value.proposta.numeroPartecipantiDesiderato;
	dati.value.descrizione=proposte.value.proposta.descrizione;
	dati.value.data=proposte.value.proposta.data.split('.')[0];
	dati.value.categorie=proposte.value.proposta.categorie;
	
	await getInteressi();
	
	nextTick(() => {
		initLeafletMap()
	})
	
	fetchDone.value=true;
});

function initLeafletMap() {
	leafletMap.value = L.map('mappa', { center: new L.LatLng(dati.value.coordinate[0], dati.value.coordinate[1]), zoom: 12, zoomControl: false });
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(leafletMap.value);
	
	marker.value = L.marker([dati.value.coordinate[0], dati.value.coordinate[1]]).addTo(leafletMap.value);
	
	leafletMap.value.on('click', clickMappa);
}

async function clickMappa(e) 
{
	const { lat, lng } = e.latlng;

	if (marker.value) {
		leafletMap.value.removeLayer(marker.value);
	}
	
	await getNomeLuogo(lat, lng);

	if (!luogoValido.value) {
		return 1;
	}
	
	marker.value = L.marker([lat, lng]).addTo(leafletMap.value);

	dati.value.coordinate[0] = lat;
	dati.value.coordinate[1] = lng;
}

async function getNomeLuogo(lat, lng) {
	const response = await fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lng);

	const data = await response.json();

	if (data.error != "Unable to geocode") {
		if (data.address.house_number && data.address.road && (data.address.city || data.address.town || data.address.village || data.address.municipality)) {
			dati.value.nomeLuogo = data.address.road + " " + data.address.house_number + ", " + (data.address.city || data.address.town || data.address.village || data.address.municipality);
			luogoValido.value = true;
		}
		else if (!data.address.house_number && data.address.road && (data.address.city || data.address.town || data.address.village || data.address.municipality)) {
			dati.value.nomeLuogo = data.address.road + ", " + (data.address.city || data.address.town || data.address.village || data.address.municipality);
			luogoValido.value = true;
		}
		else if (!data.address.road && (data.address.city || data.address.town || data.address.village || data.address.municipality)) {
			dati.value.nomeLuogo = (data.address.city || data.address.town || data.address.village || data.address.municipality);
			luogoValido.value = true;
		}
		else {
			dati.value.nomeLuogo = "Luogo non accettabile";
			luogoValido.value = false;
		}
	}
	else {
		dati.value.nomeLuogo = "Luogo non accettabile"
		luogoValido.value = false;
	}
}

async function modificaProposteButton() {	
	erroreSuccesso.value = false;
	errori.value = [];
	
	await modificaProposta(dati.value, id)
	
	if (errori.value.length == 0 && luogoValido.value) {
		await fetchPropostaId(id);
		router.back();
	}
	else {
		if (!luogoValido.value) {
			errori.value.push({ message: "Luogo non valido" });
		}
		erroreSuccesso.value = true;
	}
};

function addCategoria(interesse)
{
	var index = dati.value.categorie.indexOf(interesse);
	
	if(index>-1)
	{
		dati.value.categorie.splice(index, 1);
	}
	else
	{
		dati.value.categorie.push(interesse);
	}
}
</script>

<template>
	<form v-if="fetchDone" @submit.prevent="submitForm" @submit="modificaProposteButton()">
		<h2>Modifica Proposta:</h2>
		<div>
			<label for="titolo">Titolo:</label> 
			<input type="text" id="titolo" v-model="dati.titolo" required />
		</div>
		<div>
			<label for="luogo">Luogo:</label> 
			<input type="text" id="luogo" :value="dati.nomeLuogo" required />
		</div>
		<div>
			<label for="descrizione">Descrizione:</label> 
			<input type="text" id="descrizione" v-model="dati.descrizione" required />
		</div>
		<div>
			<label for="nParecipanti">Numero partecipanti desiderato:</label> 
			<input type="number" id="nPartecipanti" v-model="dati.numeroPartecipantiDesiderato" required />
		</div>
		<div>
			<label for="data">Data dell'evento:</label>		
			<input type="datetime-local" id="data" v-model="dati.data" required />
		</div>
		<div>
			<label>Categorie: </label>
		</div>
		<span class="contenitoreInteressi">
			<span class="interesse" v-for="interesse in interessi">
				<input type="checkbox" @click="addCategoria(interesse)" :checked="dati.categorie.includes(interesse)"/>
				{{ interesse }}
			</span>
		</span>
		<div class="alert" v-if="erroreSuccesso">
			<span class="closebtn" @click="erroreSuccesso = false">&times;</span>
			<p>Qualcosa è andato storto:</p>
			<p v-for="errore in errori">{{ errore.message }}</p>
		</div>
		<div>
			<button type="submit">Fine</button>
		</div>
	</form>
	<div v-else>Loading...</div>
	<div id="mappa" class="input-mappa"></div>
</template>