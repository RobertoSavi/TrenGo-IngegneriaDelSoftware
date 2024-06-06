<script setup>
import { ref, onMounted, watch } from 'vue';
import { loggedUser } from '../states/loggedUser.mjs';
import { notifiche, fetchNotifiche, setAllAsRead, deleteAll, readNotifica, deleteNotifica} from '../states/notifiche.mjs';
import { RouterLink } from 'vue-router'

const HOST_UTENTI = "/utenti/"

onMounted(() => {
	fetchNotifiche();
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
                    <span class="spanSorgente">Da:</span>
                    <span v-if="notifica.sorgente !== 'System'">
                        <RouterLink :to="HOST_UTENTI + notifica.sorgente">{{ notifica.sorgente }}</RouterLink>
                    </span>
                    <span v-else>System</span>
                </div>
                <label>{{ notifica.messaggio }}</label> 
				<div class="contenitoreIcone">
                <button type="button" class="icona" @click="readNotifica(notifica._id)">
                    <img src="../public/icons/notifiche_read_black.svg" alt="Segna come lette" class="icon">
                </button>
                <button type="button" class="icona" @click="deleteNotifica(notifica._id)">
                    <img src="../public/icons/notifiche_delete_black.svg" alt="Elimina tutte" class="icon">
                </button>
            </div>
            </div>
        </div>
    </div>
</template>