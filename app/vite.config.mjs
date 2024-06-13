import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	server: {
		host: true,
		port: process.env.VITE_PORT
	},
	resolve: {
		alias: {
			'@': '/src'
		}
	}
});