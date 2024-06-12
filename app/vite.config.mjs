import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	server: {
		host: true, // or true for external access
		Port: 3000,
		hmr:{
			host: true, // or true for external access
			Port: 3000,
		}
	},
	resolve: {
	  alias: {
		'@': '/src'
	  }
	}
  });