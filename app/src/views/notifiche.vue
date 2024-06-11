<script setup>
import { ref, onMounted, watch } from 'vue';
import { notifiche, fetchNotifiche, setAllAsRead, deleteAll, readNotifica, deleteNotifica} from '../states/notifiche.mjs';
import { statoNotificaEnum, tipoNotificaEnum } from '../../../server/src/models/enums.mjs';
import { RouterLink } from 'vue-router'
import router from '../router/index.mjs'

const token=localStorage.getItem('token');
const HOST_UTENTI = "/utenti/";

onMounted(() => {
	if (token==null) {
		router.push('/');
		return;
	}
	
	fetchNotifiche();
});
</script>

<template>
	<div class="bacheca">
		<div class="contenitoreHeader notifiche">
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
			<div class="notifica" v-for="notifica in notifiche"
				:class="{ 'nonVista': notifica.stato === statoNotificaEnum.NOT_SEEN, 'vista': notifica.stato === statoNotificaEnum.SEEN }">
				<div class="contenitoreHeader notifiche">
					<div class="sorgente">
						<span class="spanSorgente">Da:</span>
						<span v-if="notifica.sorgente !== 'System'">
							<RouterLink :to="HOST_UTENTI + notifica.sorgente">{{ notifica.sorgente }}</RouterLink>
						</span>
						<span v-else>System</span>
					</div>
					<div class="contenitoreIcone">
						<button type="button" class="icona" @click="readNotifica(notifica._id)">
							<img src="../public/icons/notifiche_read_black.svg" alt="Segna come letta" class="icon">
						</button>
						<button type="button" class="icona" @click="deleteNotifica(notifica._id)">
							<img src="../public/icons/notifiche_delete_black.svg" alt="Elimina" class="icon">
						</button>
					</div>
				</div>
				<div class="messaggioNotifica">{{ notifica.messaggio }}</div>
				<br>
				<RouterLink v-if="notifica.link && notifica.tipo === tipoNotificaEnum.PROPOSTA" :to="notifica.link">Accedi alla proposta
				</RouterLink>
				<RouterLink v-else-if="notifica.link && notifica.tipo === tipoNotificaEnum.CHAT" :to="notifica.link">Accedi alla chat
				</RouterLink>
				<RouterLink v-else-if="notifica.link && notifica.tipo === tipoNotificaEnum.UTENTE" :to="notifica.link"> Accedi all'utente
				</RouterLink>
			</div>
		</div>
	</div>
</template>