import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import dtsPlugin from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dtsPlugin({
      insertTypesEntry: true,
    }),
  ],

  resolve: {
    extensions: [".ts", ".js", ".vue"],
    // alias: {
    //   "#": path.resolve("src"),
    // },
  },
  build: {
    lib: {
      entry: path.resolve("src/index.ts"),
      name: "RegistrationSecretSauce",
      fileName: `registration-secret-sauce`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ["vue"],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: "Vue",
        },
        assetFileNames: "[name].[ext]",
      },
    },
    cssCodeSplit: true,
  },
});
