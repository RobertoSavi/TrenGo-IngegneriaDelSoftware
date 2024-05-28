<script setup>
import { ref, onMounted, watch } from 'vue';
import { loggedUser } from '../states/loggedUser.js';
import { RouterLink } from 'vue-router'
import {changePasswordRequest} from '../states/utenti.js';

async function richiediCambioPassword() {
    const dati = { email: email.value };
    changePasswordRequest(dati);
}

</script>

<template>
    <form class="container">
        <h2>Change Password</h2>
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required>
        <button type="button" @click="richiediCambioPassword()">Invia link di reset password</button>
    </form>
</template>

<style>
    @import '@/assets/stileHomepage.css';
</style>