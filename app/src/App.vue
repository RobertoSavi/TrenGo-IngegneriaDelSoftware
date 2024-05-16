<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { loggedUser } from './states/loggedUser.js'
const HOST_UTENTI="/utenti/";
</script>

<template>
	<div class="header"><h1>TrenGo</h1></div>
	<div class="menubar" v-if="loggedUser.token">
		<RouterLink to="/">Mie proposte</RouterLink>
		<RouterLink to="/crea/proposta">Nuova proposta</RouterLink>
		<RouterLink :to="HOST_UTENTI+loggedUser.username">Account</RouterLink>
		<RouterLink to="/">Home</RouterLink>
	</div> 
	<div class="menubar" v-else>
			<RouterLink to="/login">Login/Signup</RouterLink>
	</div> 
	<RouterView/>
</template>

<style>
@import '@/assets/general.css';
</style>
