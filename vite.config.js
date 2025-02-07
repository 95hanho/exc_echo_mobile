import { defineConfig, loadEnv } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
// import sitemapPlugin from "vite-plugin-sitemap";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd());

	if (env.VITE_ENVTYPE === "test") {
		console.log("테스트url 버전 !!!!");
	}
	return {
		plugins: [svelte()],
		server: {
		},
		define: {
			"process.env": {
			  VITE_ENVTYPE: env.VITE_ENVTYPE,
			  VITE_BASEURL: env.VITE_BASEURL
			}
		},
		build: {
			outDir: env.VITE_OUTDIR,
			copyPublicDir: false,
		},
		base:env.VITE_BASE,
	};
});
