import { MakeFormulaValue } from '../index'
import { MetaValueType } from '@toy-box/meta-schema'
import { TableValue } from '@toy-box/power-fx'

test('make number value', () => {
  expect(
    MakeFormulaValue(
      {
        key: 'number',
        type: MetaValueType.NUMBER,
        name: 'number',
      },
      12
    ).toObject()
  ).toBe(12)
  expect(
    MakeFormulaValue(
      {
        key: 'number',
        type: MetaValueType.NUMBER,
        name: 'number',
      },
      12.3
    ).toObject()
  ).toBe(12.3)
  expect(
    MakeFormulaValue(
      {
        key: 'number',
        type: MetaValueType.INTEGER,
        name: 'number',
      },
      12.3
    ).toObject()
  ).toBe(12)
})

test('make text value', () => {
  expect(
    MakeFormulaValue(
      {
        key: 'string',
        type: MetaValueType.STRING,
        name: 'string',
      },
      'Abc'
    ).toObject()
  ).toBe('Abc')
  expect(
    MakeFormulaValue(
      {
        key: 'text',
        type: MetaValueType.TEXT,
        name: 'text',
      },
      'Abc'
    ).toObject()
  ).toBe('Abc')
})

test('make array value', () => {
  expect(
    JSON.stringify(
      MakeFormulaValue(
        {
          key: 'multi',
          type: MetaValueType.MULTI_OPTION,
          name: 'multi',
        },
        ['a', 'b', 'c']
      ).toObject()
    )
  ).toBe('["a","b","c"]')
  expect(
    JSON.stringify(
      MakeFormulaValue(
        {
          key: 'multi',
          type: MetaValueType.ARRAY,
          name: 'multi',
          items: {
            type: 'string',
          },
        },
        ['a', 'b', 'c']
      ).toObject()
    )
  ).toBe('["a","b","c"]')
  expect(
    JSON.stringify(
      MakeFormulaValue(
        {
          key: 'multi',
          type: MetaValueType.ARRAY,
          name: 'multi',
          items: {
            type: MetaValueType.OBJECT,
            properties: {
              name: {
                key: 'name',
                type: MetaValueType.STRING,
                name: 'name',
              },
              value: {
                key: 'value',
                type: MetaValueType.NUMBER,
                name: 'value',
              },
            },
          },
        },
        [
          { name: 'Jack', value: 123 },
          { name: 'Tom', value: 321 },
        ]
      ).toObject()
    )
  ).toBe('[{"name":"Jack","value":123},{"name":"Tom","value":321}]')
})

test('make date value', () => {
  expect(
    (
      MakeFormulaValue(
        {
          key: 'date',
          type: MetaValueType.DATE,
          name: 'date',
        },
        '2012/3/10'
      ).toObject() as Date
    ).toISOString()
  ).toBe('2012-03-09T16:00:00.000Z')
})
