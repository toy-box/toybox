import postcss from 'rollup-plugin-postcss'
import NpmImport from 'less-plugin-npm-import'
import baseConfig from '../../scripts/rollup.base.js'

export default baseConfig(
  'toybox.metacomponents',
  'Toybox.Metacomponents',
  postcss({
    extract: true,
    minimize: true,
    sourceMap: true,
    // extensions: ['.css', '.less', '.sass'],
    use: {
      less: {
        plugins: [new NpmImport({ prefix: '~' })],
        javascriptEnabled: true,
      },
      sass: {},
      stylus: {},
    },
  })
)
