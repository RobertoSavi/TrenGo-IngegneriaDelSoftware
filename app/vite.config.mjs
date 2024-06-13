import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	server: {
		host: true,
		port: process.env.VITE_PORT||3000,
		hmr: {
			host: process.env.VITE_HOST,
			clientPort: process.env.VITE_PORT||3000
		},
	},
	resolve: {
		alias: {
			'@': '/src'
		}
	}
});