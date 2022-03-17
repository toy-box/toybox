import * as fs from 'fs'
import externalGlobals from 'rollup-plugin-external-globals'

const basicPkgs = [
  'meta-schema',
  'toybox-shared',
  'meta-powerfx',
  'toybox-ui',
  'meta-components',
]
const packages = fs
  .readdirSync('./packages')
  .filter((pkg) => !basicPkgs.includes(pkg))

export default {
  disableTypeCheck: true,
  pkgs: basicPkgs.concat(packages),
  esm: {
    type: 'babel',
    importLibToEs: true,
    minify: true,
  },
  cjs: {
    type: 'babel',
    lazy: true,
  },
  extraRollupPlugins: [
    externalGlobals({
      '@toy-box/meta-schema': 'Toybox.MetaSchema',
    }),
  ],
  extraExternals: [],
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      { libraryName: 'antd', libraryDirectory: 'es', style: true },
      'antd',
    ],
  ],
}
