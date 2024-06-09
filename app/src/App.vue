<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { loggedUser } from './states/loggedUser.mjs' 
</script>

<template>
	<div class="header"><h1>TrenGo</h1></div>
	<div class="menubar" v-if="loggedUser.token">
		<RouterLink to="/notifiche">Notifiche</RouterLink>
		<RouterLink to="/proposte/mie">Mie proposte</RouterLink>
		<RouterLink to="/proposte/crea">Nuova proposta</RouterLink>
		<RouterLink to="/chats">Chats</RouterLink>
		<RouterLink :to="'/utenti/'+loggedUser.username">Account</RouterLink>
		<RouterLink to="/">Home</RouterLink>
	</div> 
	<div class="menubar" v-else>
		<RouterLink to="/login">Login/Signup</RouterLink>
	</div> 
	<RouterView/>
</template>

<style>
	@import 'assets/stile.css';
	@import 'assets/stileNotifiche.css';
	@import 'assets/chats.css';
</style>
