import { defineConfig } from "vitest/config"

export default defineConfig({
    test: {
        singleThread: true,
        hookTimeout: 20000,
        testTimeout: 10000,
    },
})
