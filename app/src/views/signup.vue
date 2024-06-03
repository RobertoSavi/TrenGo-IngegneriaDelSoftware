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
	<form @submit.prevent="submitForm" @submit="signupButton()">
		<h2>Signup Form</h2>
		<div>
			<label>Nome:</label>
			<input type="text" v-model="dati.nome" required />
		</div>
		<div>
			<label>Cognome:</label>
			<input type="text" v-model="dati.cognome" required />
		</div>
		<div>
			<label>Username:</label>
			<input type="text" v-model="dati.username" required />
		</div>
		<div>
			<label>Email:</label>
			<input type="email" v-model="dati.email" required />
		</div>
		<div>
			<label>Password:</label>
			<input type="password" v-model="dati.password" required />
		</div>
		<div>
			<label>Interessi:</label>
		</div>
		<span class="contenitoreInteressi">
			<span class="interesse" v-for="interesse in interessi">
				<input type="checkbox" @click="addInteresse(interesse)"/>
				{{ interesse }}
			</span>
		</span>
		<div>
			<button type="submit">Sign Up</button>
		</div>
	</form>
</template>