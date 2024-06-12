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
			protocol: isDevelopment ? 'ws' : 'wss', // Use secure WebSockets in production
			host: isDevelopment ? 'localhost' : undefined, // Don't set the host in production
			port: isDevelopment ? 3000 : undefined // Don't set the port in production
		},
	},
	resolve: {
		alias: {
			'@': '/src'
		}
	}
});