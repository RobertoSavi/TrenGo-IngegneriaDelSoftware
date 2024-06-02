<script setup>
import { ref, onMounted, watch } from 'vue';
import { loggedUser } from '../states/loggedUser.js';
import { notifiche, fetchNotifiche, setAllAsRead, deleteAll} from '../states/notifiche.js';
import { RouterLink } from 'vue-router'

const HOST_PROPOSTA = "/proposte/"
const HOST_UTENTI = "/utenti/"
const warningMessage = ref('');

onMounted(() => {
    fetchNotifiche();
});


watch(loggedUser, (_loggedUser, _prevLoggedUser) => {
    warningMessage.value = ''
});
</script>


<template>
    <div class="bacheca">
        <div class="contenitoreHeader">
            <div class="contenitoreTitolo">
                <h2 style="height: 5%">Notifiche</h2>
            </div>
            <div class="contenitoreIcone">
                <button type="button" class="icona" @click="setAllAsRead()">
                    <img src="../public/icons/notifiche_read.svg" alt="Segna come lette" class="icon">
                </button>
                <button type="button" class="icona" @click="deleteAll()">
                    <img src="../public/icons/notifiche_delete.svg" alt="Elimina tutte" class="icon">
                </button>
            </div>
        </div>
        <div class="contenitoreProposte">
            <div class="notifica" v-for="notifica in notifiche" :class="{ 'nonVista': !notifica.stato==='Non vista' }">
                <div class="sorgente">
                    <span class="labelSorgente">Da:</span>
                    <span v-if="notifica.sorgente !== 'System'">
                        <RouterLink :to="HOST_UTENTI + notifica.sorgente">{{ notifica.sorgente }}</RouterLink>
                    </span>
                    <span v-else>System</span>
                </div>
                <label></label> {{ notifica.messaggio }}
            </div>
        </div>
    </div>
</template>

<style>
@import '@/assets/stileHomepage.css';
@import '@/assets/stileNotifiche.css';
</style>
