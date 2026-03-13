import react from "@vitejs/plugin-react"
import * as path from "node:path"
import type { InlineConfig } from "vitest/node"
import { defineConfig, type UserConfig } from "vite"
import packageJson from "./package.json" with { type: "json" }

const test = {
  root: import.meta.dirname,
  name: packageJson.name,
  environment: "jsdom",
  typecheck: {
    enabled: true,
    tsconfig: path.join(import.meta.dirname, "tsconfig.json"),
  },
  globals: true,
  watch: false,
  setupFiles: ["./src/setupTests.ts"],
} satisfies InlineConfig

const config = {
  plugins: [react()],
  server: {
    open: true,
  },
  test,
} satisfies UserConfig & { test: InlineConfig }

export default defineConfig(config)
