import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [tailwindcss(), sveltekit()],
  server: {
	host: '0.0.0.0',
	allowedHosts: ['q2rzva-ip-187-209-204-199.tunnelmole.net']
  }

});
