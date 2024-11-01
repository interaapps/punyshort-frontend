import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue"
import path from "path"
import {fileURLToPath, URL} from "node:url"

export default defineConfig({
    plugins: [vue()],

    resolve: {
        alias: {
            extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
            "@": fileURLToPath(new URL("./src", import.meta.url))
        }
    }
})