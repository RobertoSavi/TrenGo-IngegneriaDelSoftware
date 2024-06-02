<script setup>
import {ref} from 'vue';
import {useRoute} from 'vue-router'
import router from '../router/index.js';
import {changePassword} from '../states/utenti.js';

const route = useRoute();
const token=route.params.token;
const warningMessage = ref('');

async function cambioPassword() {
    if(new_password.value != confirm_password.value){
        warningMessage.value = 'Le password non coincidono';
        return;
    }
    warningMessage.value = ''
    const dati = {new_password: new_password.value};
    await changePassword(dati,token);
    router.push('/login');
}

</script>

<template>
    <form class="container-flex">
        <label for="new_password">Nuova password:</label>
        <input type="password" id="new_password" name="new_password" required>
        <label for="confirm_password">Conferma nuova password:</label>
        <input type="password" id="confirm_password" name="confirm_password" required>
        <span style="color: red">{{ warningMessage }}</span>
        <button type="button" @click="cambioPassword()">Cambia password</button>
    </form>
</template>
