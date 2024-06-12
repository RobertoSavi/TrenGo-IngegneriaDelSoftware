import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue(), mkcert()],
	server: {
		http: true,
		https: true,
		host: true,
		port: process.env.VITE_PORT||3000,
		hmr: {
			protocol: 'wss', // Use secure WebSockets in production
		},
	},
	resolve: {
		alias: {
			'@': '/src'
		}
	}
});