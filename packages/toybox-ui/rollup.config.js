import postcss from 'rollup-plugin-postcss'
import NpmImport from 'less-plugin-npm-import'
import baseConfig, {
  removeImportStyleFromInputFilePlugin,
} from '../../scripts/rollup.base.js'

export default baseConfig(
  'toybox.ui',
  'Toybox.Ui',
  removeImportStyleFromInputFilePlugin(),
  postcss({
    extract: true,
    minimize: true,
    sourceMap: true,
    extensions: ['.css', '.less', '.sass'],
    use: {
      less: {
        plugins: [new NpmImport({ prefix: '~' })],
        javascriptEnabled: true,
        modifyVars: {
          'root-entry-name': 'default',
        },
      },
      sass: {},
      stylus: {},
    },
  })
)
