<script setup>
import { ref, onMounted } from 'vue';
import { interessi, getInteressi } from '../states/utenti.js'

const dati = ref({
	nome: "",
	cognome: "",
	email: "",
	password: "",
	interessi: []
});


onMounted(() => {
	getInteressi();
});

function signupButton() {
	console.log(dati.value.interessi);
}

function addInteresse(interesse)
{
	if(dati.value.interessi.includes(interesse))
	{
		dati.value.interessi.pop(interesse);
	}
	else
	{
		dati.value.interessi.push(interesse);
	}
}

</script>

<template>
	<h1>Signup Form</h1>
	<form @submit.prevent="submitForm" @submit="signupButton()">
		<div class="container-flex">
			<div>
				<label for="firstName">First Name:</label>
				<input type="text" v-model="dati.firstName" id="firstName" required />
			</div>
			<div>
				<label for="lastName">Last Name:</label>
				<input type="text" v-model="dati.lastName" id="lastName" required />
			</div>
			<div>
				<label for="email">Email:</label>
				<input type="email" v-model="dati.email" id="email" required />
			</div>
			<div>
				<label for="password">Password:</label>
				<input type="password" v-model="dati.password" id="password" required />
			</div>
			<div>
				<label>Interessi:</label>
			</div>
		</div>
		<div class="container-flex">
			<span v-for="interesse in interessi" class="checkbox-item">
				<label>{{ interesse }}:</label>
				<input type="checkbox" @click="addInteresse(interesse)"/>
			</span>
		</div>
		<button type="submit">Sign Up</button>
	</form>
</template>

<style>
	@import '@/assets/stileSignup.css';
</style>