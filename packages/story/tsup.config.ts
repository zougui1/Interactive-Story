import { defineConfig } from 'tsup';

export default defineConfig({
  experimentalDts: true,
  sourcemap: true,
  format: ['cjs', 'esm'],
  outDir: 'lib',
});
