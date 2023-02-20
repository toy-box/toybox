import json from '@rollup/plugin-json'
import baseConfig from '../../scripts/rollup.base.js'

export default baseConfig('toybox.metaSchema', 'Toybox.MetaSchema', json())
