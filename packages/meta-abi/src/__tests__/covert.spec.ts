import { MetaValueType } from '@toy-box/meta-schema'
import { AbiItem } from 'web3-utils'
import { convertType, convertAbiConstructor } from '../index'

test('convert type', () => {
  const typeSchema = convertType({
    type: 'uint',
    name: 'amount',
  })
  expect(typeSchema.type).toEqual(MetaValueType.INTEGER)
  expect(typeSchema.key).toEqual('amount')
})

test('convert abi functions', () => {
  const abi: AbiItem[] = [
    {
      inputs: [
        {
          internalType: 'string',
          name: '_title',
          type: 'string',
        },
        {
          internalType: 'string',
          name: '_description',
          type: 'string',
        },
        {
          internalType: 'uint256',
          name: '_min',
          type: 'uint256',
        },
        {
          internalType: 'uint256',
          name: '_max',
          type: 'uint256',
        },
        {
          internalType: 'string[]',
          name: '_targets',
          type: 'string[]',
        },
        {
          internalType: 'address',
          name: '_matchBulk',
          type: 'address',
        },
        {
          internalType: 'address',
          name: '_slipBulk',
          type: 'address',
        },
        {
          internalType: 'address',
          name: '_token',
          type: 'address',
        },
        {
          internalType: 'address',
          name: '_account',
          type: 'address',
        },
      ],
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
  ]
  const abiSchema = convertAbiConstructor(abi)
  expect(abiSchema.type).toEqual('constructor')
  expect(abiSchema.inputs?.length).toEqual(9)
})

test('convert tuple type', () => {
  const typeSchema = convertType({
    type: 'tuple',
    components: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'string',
        name: 'nick',
        type: 'string',
      },
    ],
    name: 'struct',
  })
  expect(typeSchema.type).toEqual(MetaValueType.OBJECT)
})
