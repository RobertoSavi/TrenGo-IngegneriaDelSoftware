import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	server: {
		Port: 3000,
		hmr:{
			Port: 3000,
		}
	},
	resolve: {
	  alias: {
		'@': '/src'
	  }
	}
  });