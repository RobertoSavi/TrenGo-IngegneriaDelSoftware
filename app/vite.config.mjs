import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

const isDevelopment = process.env.NODE_ENV === 'development';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	server: {
		host: true,
		port: process.env.VITE_PORT||3000,
		hmr: {
			protocol: 'ws', // Use secure WebSockets in production
		},
	},
	resolve: {
		alias: {
			'@': '/src'
		}
	}
});