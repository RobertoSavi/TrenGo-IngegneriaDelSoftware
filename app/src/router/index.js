import { createRouter, createWebHistory } from 'vue-router'
import homepage from '../views/homepage.vue'
import proposta from '../views/proposte.vue'
import utenti from '../views/utenti.vue'
import np from '../views/nuovaProposta.vue'
import login from '../views/login.vue'

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
      	path: '/utenti/:username',
      	name: 'utenti',
      	component: utenti
    },
    {
      	path: '/crea/proposta',
      	name: 'nuova proposta',
      	component: np
    },
    {
      	path: '/login',
      	name: 'login',
      	component: login
    }
  ]
})

export default router
