<script setup>
import { ref, onMounted } from 'vue';
import { interessi, getInteressi, signup, login } from '../states/utenti.js'
import { setLoggedUser } from '../states/loggedUser.js'
import router from '../router/index.js'

const dati = ref({
	//nome: "",
	//cognome: "",
	username: "",
	email: "",
	password: ""
	//interessi: []
});


onMounted(() => {
	getInteressi();
});

async function signupButton() {
	await signup(dati.value);
	const response=await login(JSON.stringify({ username: "dati.username", password: "dati.password"}));
	setLoggedUser(response.data);
	router.push('/');
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
			<!--<div>
				<label for="nome">Nome:</label>
				<input type="text" v-model="dati.nome" id="nome" required />
			</div>
			<div>
				<label for="cognome">Cognome:</label>
				<input type="text" v-model="dati.cognome" id="cognome" required />
			</div>-->
			<div>
				<label for="username">Username:</label>
				<input type="text" v-model="dati.username" id="username" required />
			</div>
			<div>
				<label for="email">Email:</label>
				<input type="email" v-model="dati.email" id="email" required />
			</div>
			<div>
				<label for="password">Password:</label>
				<input type="password"  v-model="dati.password" id="password" required />
			</div>
		</div>
		<!--
		<div class="container-flex">
			<div>
				<label>Interessi:</label>
			</div>
			<span v-for="interesse in interessi" class="checkbox-item">
				<label>{{ interesse }}:</label>
				<input type="checkbox" @click="addInteresse(interesse)"/>
			</span>
		</div>		-->
		<button type="submit">Sign Up</button>
	</form>
</template>