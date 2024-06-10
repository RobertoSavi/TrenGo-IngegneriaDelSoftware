<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { loggedUser } from '../states/loggedUser.mjs';
import { errori, fetchProposte, creaProposta } from '../states/proposte.mjs';
import { interessi, getInteressi } from '../states/utenti.mjs'
import L from 'leaflet'
import router from '../router/index.mjs';

const luogoValido = ref(false);
const leafletMap = ref();
const marker = ref();
const dati = ref({
	titolo: "a",
	nomeLuogo: "Selezionare dalla mappa",
	coordinate: [],
	numeroPartecipantiDesiderato: "1",
	descrizione: "a",
	data: "",
	categorie: []
});
const erroreSuccesso = ref(false)

onMounted(async () => {
	if(!loggedUser.token)
	{
		router.push('/');
		return;
	}
	
	await getInteressi();

	nextTick(() => {
		initLeafletMap()
	})
});

function initLeafletMap() {
	leafletMap.value = L.map('mappa', { center: new L.LatLng(46.0677, 11.1215), zoom: 12, zoomControl: false });
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(leafletMap.value);

	leafletMap.value.on('click', clickMappa);
}

async function clickMappa(e) {
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

async function creaProposteButton() {
	erroreSuccesso.value = false;
	errori.value = [];

	await creaProposta(dati.value);

	if (errori.value.length == 0 && luogoValido.value) {
		await fetchProposte();
		router.push('/');
	}
	else {
		if (!luogoValido.value) {
			errori.value.push({ message: "Luogo non valido" });
		}
		erroreSuccesso.value = true;
	}

};

function addCategoria(interesse) {
	var index = dati.value.categorie.indexOf(interesse);

	if (index > -1) {
		dati.value.categorie.splice(index, 1);
	}
	else {
		dati.value.categorie.push(interesse);
	}
}

// Restituisce il nome di un luogo dalle coordinate date
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
</script>

<template>
	<form @submit.prevent="submitForm" @submit="creaProposteButton()">
		<h2>Nuova Proposta:</h2>
		<div>
			<label for="titolo">Titolo:</label>
			<input type="text" v-model="dati.titolo" required />
		</div>
		<div>
			<label for="luogo">Luogo:</label>
			<input type="text" :value="dati.nomeLuogo" readonly />
		</div>
		<div>
			<label for="descrizione">Descrizione:</label>
			<input type="text" v-model="dati.descrizione" required />
		</div>
		<div>
			<label for="nParecipanti">Numero partecipanti desiderato:</label>
			<input type="number" v-model="dati.numeroPartecipantiDesiderato" required />
		</div>
		<div>
			<label for="data">Data dell'evento:</label>
			<input type="datetime-local" v-model="dati.data" required />
		</div>
		<div>
			<label>Categorie:</label>
		</div>
		<span class="contenitoreInteressi">
			<span class="interesse" v-for="interesse in interessi">
				<input type="checkbox" @click="addCategoria(interesse)" />
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
	<div class="input-mappa" id="mappa"></div>
</template>