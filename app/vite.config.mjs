import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dotenv from 'dotenv';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	server: {
		host: process.env.VITE_HOST,
		port: process.env.VITE_PORT, 
		open: true, 
	},
	resolve: {
		alias: {
			'@': '/src'
		}
	}
})