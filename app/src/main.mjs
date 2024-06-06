import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index.mjs'
import 'leaflet/dist/leaflet.css';

const app = createApp(App)

app.use(router)

app.mount('#app')