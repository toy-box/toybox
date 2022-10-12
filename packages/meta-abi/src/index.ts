import { IFieldMeta, MetaValueType } from '@toy-box/meta-schema'
import { AbiInput, AbiOutput, AbiItem } from 'web3-utils'
import { merge } from 'merge'

export type AbiItemSchema = Omit<AbiItem, 'inputs' | 'outputs'> & {
  inputs?: IFieldMeta[]
  outputs?: IFieldMeta[]
}

const TypeMaps = {
  int: {
    type: MetaValueType.INTEGER,
  },
  uint: {
    type: MetaValueType.INTEGER,
  },
  // address: equivalent to uint160, except for the assumed interpretation and language typing.
  address: {
    type: MetaValueType.STRING,
    pattern: '0x[a-fA-F0-9]{40}',
  },
  // fixed, ufixed: synonyms for fixed128x18, ufixed128x18
  fixed: {
    // fixed128x18
    type: MetaValueType.NUMBER,
  },
  ufixed: {
    // ufixed128x18
    type: MetaValueType.NUMBER,
  },

  bytes: {
    // bytes
    type: MetaValueType.TEXT,
  },
  // bool: equivalent to uint8 restricted to the values 0 and 1. For computing the function selector, bool is used.
  bool: {
    type: MetaValueType.BOOLEAN,
  },
  string: {
    type: MetaValueType.STRING,
  },
  tuple: {
    type: MetaValueType.OBJECT,
    properties: {},
  },
}

const typesRegex = {
  '^int\\d{1,3}$': TypeMaps.int,
  '^uint\\d{1,3}$': TypeMaps.uint,
  '^fixed\\d{1,3}x\\d{1,2}': TypeMaps.fixed,
  '^ufixed\\d{1,3}x\\d{1,2}': TypeMaps.ufixed,
  '^bytes\\d{1,3}': TypeMaps.bytes,
}

function mapType(type) {
  const mapped = TypeMaps[type]
  if (mapped) {
    return merge(true, mapped)
  }

  for (let pattern in typesRegex) {
    const exp = new RegExp(pattern)
    if (exp.test(type)) {
      return merge(true, typesRegex[pattern])
    }
  }
  throw new Error(`Unsupported type: ${type}`)
}

function mapAbiNode(node: AbiItem): AbiItemSchema {
  const { inputs, outputs, ...props } = node
  return {
    ...props,
    inputs: inputs?.map((input) => convertType(input)),
    outputs: outputs?.map((output) => convertType(output)),
  }
}

export function convertAbiFunctions(abi: AbiItem[]) {
  return abi
    .filter((node) => node.type === 'function')
    .map((node) => mapAbiNode(node))
}

export function convertAbiEvents(abi: AbiItem[]) {
  return abi
    .filter((node) => node.type === 'event')
    .map((node) => mapAbiNode(node))
}

export function convertAbiConstructor(abi: AbiItem[]) {
  return mapAbiNode(abi.find((node) => node.type === 'constructor'))
}

export function convertType(abiIO: AbiInput | AbiOutput): IFieldMeta {
  let mapped = TypeMaps[abiIO.type]

  if (mapped == null) {
    const arrayExp = /'[]$'/
    // array
    if (arrayExp.test(abiIO.type)) {
      const itemBaseType = abiIO.type.substring(0, abiIO.type.length - 3)
      const itemMapped = TypeMaps[itemBaseType] ?? mapType(itemBaseType)
      const arrayMeta: IFieldMeta = {
        type: 'array',
        key: abiIO.name,
        name: abiIO.name,
        items: {
          ...itemMapped,
        },
      }
      if (itemMapped.type === MetaValueType.OBJECT) {
        abiIO.components.forEach((component) => {
          arrayMeta.properties[component.name] = convertType(component)
        })
      }
      return arrayMeta
    }
  }

  if (mapped.type === MetaValueType.OBJECT) {
    abiIO.components.forEach((component) => {
      mapped.properties[component.name] = convertType(component)
    })
  }

  return {
    ...mapped,
    key: abiIO.name,
    name: abiIO.name,
  }
}
