import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

const extensions = [ '.js', '.jsx', '.ts', '.tsx' ];
const packageName = 'fetchAllSpreadSheet';


export default {
  input: './src/index.ts',
  output: [
    {
      // CommonJS
      file: `dist/${packageName}.js`,
      format: 'cjs',
    },
    {
      // ES Module
      file: `dist/${packageName}.esm.js`,
      format: 'es',
    },
  ],
  plugins: [
    resolve(),
    commonjs(),
    babel({
      extensions,
      include: ['src/**/*'],
    })
  ],
};

