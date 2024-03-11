import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { browserslistToTargets } from 'lightningcss'
import browserslist from 'browserslist'
import Icons from 'unplugin-icons/vite'

export default defineConfig({
	plugins: [
    sveltekit(),
    Icons({
      compiler: 'svelte',
      autoInstall: true
    })
  ],
  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: browserslistToTargets(browserslist('>= 0.25%')),
    }
  },
  build: {
    cssMinify: 'lightningcss'
  }
});
