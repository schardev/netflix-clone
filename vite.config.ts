import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import baseSsl from "@vitejs/plugin-basic-ssl";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});
