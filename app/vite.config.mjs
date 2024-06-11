import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dotenv from 'dotenv';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	server: {
		host: true,
		port: process.env.VITE_PORT, 
		protocol: "ws",
	},
	resolve: {
		alias: {
			'@': '/src'
		}
	}
})