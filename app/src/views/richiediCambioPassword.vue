<script setup>
import router from '../router/index.mjs';
import {changePasswordRequest} from '../states/utenti.mjs';

async function richiediCambioPassword() {
    const dati = { email: email.value };
    await changePasswordRequest(dati);
    router.push('/');
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
