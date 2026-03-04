import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://astro--daily.vercel.app",
  server: { 
    host: true,
  },
  image: {
    domains: ["apod.nasa.gov", "astro.build"],
  },
  output: "server",
  adapter: vercel({
    imageService: true,
  }),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [],
});
