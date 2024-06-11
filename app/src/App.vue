<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'

const token=ref(localStorage.getItem('token'));
const loggedUsername=ref(localStorage.getItem('username'));
</script>

<template>
	<div class="header"><h1>TrenGo</h1></div>
	<div class="menubar" v-if="token!=null">
		<RouterLink to="/notifiche">Notifiche</RouterLink>
		<RouterLink to="/proposte/mie">Mie proposte</RouterLink>
		<RouterLink to="/proposte/crea">Nuova proposta</RouterLink>
		<RouterLink to="/chats">Chats</RouterLink>
		<RouterLink :to="'/utenti/'+loggedUsername">Account</RouterLink>
		<RouterLink to="/">Home</RouterLink>
	</div> 
	<div class="menubar" v-else>
		<RouterLink to="/login">Login/Signup</RouterLink>
	</div> 
	<RouterView/>
</template>

<style>
	@import '@/assets/stile.css';
	@import '@/assets/stileNotifiche.css';
	@import '@/assets/chats.css';
	@import '@/assets/stileAlert.css';
</style>
