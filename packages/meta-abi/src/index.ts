import { IFieldMeta, MetaValueType } from '@toy-box/meta-schema'
import { AbiInput, AbiOutput, AbiItem } from 'web3-utils'
import { merge } from 'merge'

export type AbiItemSchema = Omit<AbiItem, 'inputs' | 'outputs'> & {
  inputs?: IFieldMeta[]
  outputs?: IFieldMeta[]
}

const TypeMaps: Record<string, Partial<IFieldMeta> & { type: MetaValueType }> =
  {
    int: {
      type: MetaValueType.BIG_INT,
    },
    uint: {
      type: MetaValueType.BIG_INT,
    },
    fixd: {
      type: MetaValueType.BIG_NUMBER,
    },
    ufixed: {
      type: MetaValueType.BIG_NUMBER,
    },
    // address: equivalent to uint160, except for the assumed interpretation and language typing.
    address: {
      type: MetaValueType.STRING,
      pattern: '0x[a-fA-F0-9]{40}',
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
  '^bytes\\d{1,3}': TypeMaps.bytes,
}

const ARRAY_EXP = /(\[\d*\])+$/
const ARRAY_EXP_G = /\[\d*\]/g

function isArrayType(type: string) {
  return ARRAY_EXP.test(type)
}

function mapType(type: string) {
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
    inputs: inputs?.map((input) => convertIOType(input)),
    outputs: outputs?.map((output) => convertIOType(output)),
  }
}

export function convertAbiFunctions(abi: AbiItem[]): AbiItemSchema[] {
  return abi
    .filter((node) => node.type === 'function')
    .map((node) => mapAbiNode(node))
}

export function convertAbiEvents(abi: AbiItem[]): AbiItemSchema[] {
  return abi
    .filter((node) => node.type === 'event')
    .map((node) => mapAbiNode(node))
}

export function convertAbiConstructor(abi: AbiItem[]) {
  return mapAbiNode(abi.find((node) => node.type === 'constructor'))
}

export function convertIOType(abiIO: AbiInput | AbiOutput): IFieldMeta {
  let mapped = TypeMaps[abiIO.type]

  if (mapped == null) {
    // array
    if (isArrayType(abiIO.type)) {
      const itemBaseType = abiIO.type.substring(
        0,
        abiIO.type.match(ARRAY_EXP).index
      )
      const itemMapped = TypeMaps[itemBaseType] ?? mapType(itemBaseType)
      const arrayLayers = [...abiIO.type.matchAll(ARRAY_EXP_G)]
      let items = { ...itemMapped }
      if (arrayLayers.length > 1) {
        for (let l = 1; l < arrayLayers.length; l++) {
          items = {
            type: 'array',
            items,
          }
        }
      }
      const arrayMeta: IFieldMeta = {
        type: 'array',
        key: abiIO.name,
        name: abiIO.name,
        items,
      }
      if (itemMapped.type === MetaValueType.OBJECT) {
        abiIO.components.forEach((component) => {
          arrayMeta.properties[component.name] = convertIOType(component)
        })
      }
      return arrayMeta
    } else {
      return mapType(abiIO.type)
    }
  }

  if (mapped.type === MetaValueType.OBJECT) {
    abiIO.components.forEach((component) => {
      mapped.properties[component.name] = convertIOType(component)
    })
  }

  return {
    ...mapped,
    key: abiIO.name,
    name: abiIO.name,
  }
}
