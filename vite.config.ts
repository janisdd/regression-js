import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import pkg from './package.json'

export default defineConfig({
  build: {
    minify: false,
    lib: {
      entry: './src/regression.ts',
      formats: ['umd'],
      name: 'regression',
      fileName: 'regression',
    },
    rollupOptions: {
      external: [
        ...Object.keys(pkg.devDependencies), // don't bundle dependencies
        /^node:.*/, // don't bundle built-in Node.js modules (use protocol imports!)
        "big.js",
      ],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          "big.js": 'Big',
        },
      },
    },
    target: 'esnext', // transpile as little as possible
  },
  plugins: [dts()], // emit TS declaration files
})
