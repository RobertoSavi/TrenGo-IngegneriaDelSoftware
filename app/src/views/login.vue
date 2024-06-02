<script setup>
import { ref, onMounted } from 'vue'
import { loggedUser, setLoggedUser, clearLoggedUser } from '../states/loggedUser.js'
import axios from 'axios'
import { RouterLink } from 'vue-router'

const API_URL = import.meta.env.VITE_API_HOST || `http://localhost:5050/api`
const UTENTI_URL = API_URL+`/utenti`

const username = ref('example_username')
const password = ref('example_passworD1')

async function login() {
	const response = await axios.post(
		UTENTI_URL+'/login',
		JSON.stringify( { username: username.value, password: password.value }), 
		{headers: { 'Content-Type': 'application/json' }}
	);
	
	const dati= response.data;
	setLoggedUser(dati);
};


function logout() {
  clearLoggedUser()
}

</script>

<template>
  <form>
    <span v-if="loggedUser.token">
      Welcome {{loggedUser.username}}
      <button type="button" @click="logout()">LogOut</button>
    </span>
    
    <span v-if="!loggedUser.token">
      <input name="username" v-model="username" />
      <input name="password" v-model="password" />
      <button type="button" @click="login()">LogIn</button>
    </span>

    <RouterLink :to="'/passworddimenticata'">Password dimenticata?</RouterLink>
    
  </form>
</template>
