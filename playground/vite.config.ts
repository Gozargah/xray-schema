import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    tsconfigPaths: true,
    alias: {
      "monaco-editor-core": "monaco-editor",
    },
  },
  plugins: [tailwindcss(), react(), babel({ presets: [reactCompilerPreset()] })],
  build: {
    target: "esnext",
    cssMinify: "lightningcss",
    rollupOptions: {
      output: {
        manualChunks: (moduleId) => {
          if (moduleId.includes("monaco")) {
            return "monaco-editor";
          }
          return null;
        },
      },
    },
  },
});
