import path from 'path'
import typescript from 'rollup-plugin-typescript2'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import externalGlobals from 'rollup-plugin-external-globals'
import injectProcessEnv from 'rollup-plugin-inject-process-env'
import dts from 'rollup-plugin-dts'
import { terser } from 'rollup-plugin-terser'

const presets = () => {
  const externals = {
    antd: 'antd',
    react: 'React',
    moment: 'moment',
    'react-is': 'ReactIs',
    'react-dom': 'ReactDOM',
    '@ant-design/icons': 'icons',
    '@airclass/icons': 'AirclassIcons',
    '@toy-box/toybox-shared': 'Toybox.Shared',
    '@toy-box/meta-schema': 'Toybox.MetaSchema',
    '@toy-box/toybox-ui': 'Toybox.Ui',
    '@toy-box/meta-components': 'Toybox.Metacomponents',
    '@toy-box/meta-abi': 'Toybox.MetaAbi',
  }
  return [
    typescript({
      tsconfig: './tsconfig.build.json',
      tsconfigOverride: {
        compilerOptions: {
          module: 'ESNext',
          declaration: false,
        },
      },
    }),
    resolve(),
    commonjs(),
    externalGlobals(externals, {
      exclude: ['**/*.{less,sass,scss}'],
    }),
  ]
}

const createEnvPlugin = (env) => {
  return injectProcessEnv(
    {
      NODE_ENV: env,
    },
    {
      exclude: '**/*.{css,less,sass,scss}',
      verbose: false,
    }
  )
}

const inputFilePath = path.join(process.cwd(), 'src/index.ts')

const noUIDtsPackages = ['toybox.shared', 'toybox.metaSchmea', 'toybox.metaAbi']

export const removeImportStyleFromInputFilePlugin = () => ({
  name: 'remove-import-style-from-input-file',
  transform(code, id) {
    // 样式由 build:style 进行打包，所以要删除入口文件上的 `import './style'`
    if (inputFilePath === id) {
      return code.replace(`import './style';`, '')
    }

    return code
  },
})

export default (filename, targetName, ...plugins) => {
  const base = [
    {
      input: 'src/index.ts',
      output: {
        format: 'umd',
        file: `dist/${filename}.umd.development.js`,
        name: targetName,
        sourcemap: true,
        amd: {
          id: filename,
        },
      },
      external: ['react', 'react-dom', 'react-is'],
      plugins: [...presets(), ...plugins, createEnvPlugin('development')],
    },
    {
      input: 'src/index.ts',
      output: {
        format: 'umd',
        file: `dist/${filename}.umd.production.js`,
        name: targetName,
        sourcemap: true,
        amd: {
          id: filename,
        },
      },
      external: ['react', 'react-dom', 'react-is'],
      plugins: [
        ...presets(),
        terser(),
        ...plugins,
        createEnvPlugin('production'),
      ],
    },
  ]

  if (noUIDtsPackages.includes(filename)) {
    base.push({
      input: 'esm/index.d.ts',
      output: {
        format: 'es',
        file: `dist/${filename}.d.ts`,
      },
      plugins: [dts(), ...plugins],
    })
    base.push({
      input: 'esm/index.d.ts',
      output: {
        format: 'es',
        file: `dist/${filename}.all.d.ts`,
      },
      plugins: [
        dts({
          respectExternal: true,
        }),
        ...plugins,
      ],
    })
  }

  return base
}
