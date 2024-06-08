<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { loggedUser } from '../states/loggedUser.js';
import { creaProposta } from '../states/proposte.js';
import { interessi, getInteressi } from '../states/utenti.js'
import L from 'leaflet'
import router from '../router/index.js';

const luogoValido = ref(false);
const leafletMap = ref();
const marker = ref();
const dati = ref({
	usernameCreatore: loggedUser.username,
	creatore: loggedUser.id,
	titolo: "",
	nomeLuogo: "",
	coordinate: [],
	numeroPartecipantiDesiderato: "",
	descrizione: "",
	data: "",
	categorie: []
});

onMounted(async () => {
	await getInteressi();

	nextTick(() => {
		initLeafletMap()
	})
});

function initLeafletMap() {
	leafletMap.value = L.map('mappa', { center: new L.LatLng(46.0677, 11.1215), zoom: 12, zoomControl: false });
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(leafletMap.value);

	leafletMap.value.on('click', async function (e) {
		const { lat, lng } = e.latlng;

		await getNomeLuogo(lat, lng);

		if (!luogoValido.value) {
			return 1;
		}

		if (marker.value) {
			leafletMap.value.removeLayer(marker.value);
		}

		marker.value = L.marker([lat, lng]).addTo(leafletMap.value);

		dati.value.coordinate[0] = lat;
		dati.value.coordinate[1] = lng;
	});

}

function creaProposteButton() {
	/*if (dati.value.titolo == "" || dati.value.nomeLuogo == "" || dati.value.descrizione == "" || dati.value.numeroPartecipantiDesiderato <= 1) {
		warningMessage.value = 'Compilare i campi'
		return;
	}*/

	if (luogoValido) {
		creaProposta(dati.value);
		router.back;
	}
};

function addCategoria(categoria) {
	if (dati.value.categorie.includes(categoria)) {
		dati.value.categorie.pop(categoria);
	}
	else {
		dati.value.categorie.push(categoria);
	}
}

// Restituisce il nome di un luogo dalle coordinate date
async function getNomeLuogo(lat, lng) {
	const response = await fetch('https://nominatim.openstreetmap.org/reverse?format=json&lat=' + lat + '&lon=' + lng);

	const data = await response.json();

	if (data.error != "Unable to geocode") {
		if (data.address.house_number && data.address.road && (data.address.town || data.address.village || data.address.city || data.address.municipality)) {
			dati.value.nomeLuogo = data.address.road + " " + data.address.house_number + ", " + (data.address.town || data.address.village || data.address.city || data.address.municipality);
			luogoValido.value = true;
		}
		else if (!data.address.house_number && data.address.road && (data.address.town || data.address.village || data.address.city || data.address.municipality)) {
			dati.value.nomeLuogo = data.address.road + ", " + (data.address.town || data.address.village || data.address.city || data.address.municipality);
			luogoValido.value = true;
		}
		else if (!data.address.road && (data.address.town || data.address.village || data.address.city || data.address.municipality)) {
			dati.value.nomeLuogo = (data.address.town || data.address.village || data.address.city || data.address.municipality);
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

	console.log(data);
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
			<span @click="" class="input-mappa" id="mappa"></span>
			{{ dati.nomeLuogo }}
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
		<div>
			<button type="submit">Fine</button>
		</div>
	</form>
</template>