<script setup>
import { ref, onMounted } from 'vue';
import { errori, interessi, getInteressi, signup, login } from '../states/utenti.mjs'
import router from '../router/index.mjs'

const dati = ref({
	nome: "",
	cognome: "",
	username: "",
	email: "",
	password: "",
	interessi: []
});
const erroreSuccesso = ref(false)


onMounted(() => {
	getInteressi();
});

async function signupButton() {
	erroreSuccesso.value = false;
	errori.value = [];
	
	await signup(dati.value);
	
	if(errori.value.length==0)
	{
		const response=await login({ "username": dati.value.username, "password": dati.value.password});
		localStorage.setItem('token', response.data.token);
		localStorage.setItem('username', response.data.loggedUsername);
		localStorage.setItem('id', response.data.id);
		await router.push('/');
		router.go(0);
	}
	else
	{
		erroreSuccesso.value = true;
	}
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
		<div class="alert" v-if="erroreSuccesso">
			<span class="closebtn" @click="erroreSuccesso = false">&times;</span>
			<p>Qualcosa è andato storto:</p>
			<p v-for="errore in errori">{{ errore.message }}</p>
		</div>
		<div>
			<button type="submit">Sign Up</button>
		</div>
	</form>
</template>