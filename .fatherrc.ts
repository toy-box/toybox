import externalGlobals from 'rollup-plugin-external-globals'

export default {
  pkgs: ['meta-schema', 'toybox-shared', 'meta-components'],
  esm: {
    type: 'babel',
    importLibToEs: true,
  },
  cjs: {
    type: 'babel',
    lazy: true,
  },
  extraRollupPlugins: [
    externalGlobals(
      {
        '@toy-box/meta-schema': 'Toybox.MetaSchema',
      },
      {
        exclude: ['**/*.{less,sass,scss}'],
      }
    ),
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
