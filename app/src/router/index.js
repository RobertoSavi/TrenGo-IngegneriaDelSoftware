import { createRouter, createWebHistory } from 'vue-router'
import homepage from '../views/homepage.vue'
import proposta from '../views/proposte.vue'
import utenti from '../views/utenti.vue'
import np from '../views/nuovaProposta.vue'
import login from '../views/login.vue'
import mp from '../views/modificaProposta.vue'
import miep from '../views/mieProposte.vue'
import richiedicambiop from '../views/richiediCambioPassword.vue'
import cambiop from '../views/cambioPassword.vue'
import notifiche from '../views/notifiche.vue'


const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
	{
    	path: '/',
      	name: 'home',
      	component: homepage
    },
    {
     	path: '/proposte/:id',
      	name: 'proposte',
      	component: proposta
    },
    {
      	path: '/proposte/crea',
      	name: 'nuova proposta',
      	component: np
    },
    {
      	path: '/proposte/modifica/:id',
      	name: 'modifica proposta',
      	component: mp
    },
    {
      	path: '/proposte/mie',
      	name: 'mie proposte',
      	component: miep
    },
    {
      	path: '/utenti/:username',
      	name: 'utenti',
      	component: utenti
    },
    {
      	path: '/login',
      	name: 'login',
      	component: login
    },
	{
		path: '/passworddimenticata',
		name: 'richiedi cambio password',
		component: richiedicambiop
  	},
	{
		path: '/cambiopassword/:token',
		name: 'cambio password',
		component: cambiop
  	},
	{
		path: '/notifiche/',
		name: 'notifiche',
		component: notifiche
	}
  ]
})

export default router
