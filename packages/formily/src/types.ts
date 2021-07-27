import { SchemaReactions } from '@formily/react'
import { IFieldItems } from '@toy-box/meta-schema'

export interface IMetaSchema extends Toybox.MetaSchema.Types.IFieldMeta {
  properties?: Record<string, IMetaSchema>
  items?: IFieldItems<IMetaSchema>
  //交互模式
  ['x-pattern']?: string
  //展示状态
  ['x-display']?: string
  //校验器
  ['x-validator']?: any
  //装饰器
  ['x-decorator']?: any
  //装饰器属性
  ['x-decorator-props']?: any
  //组件
  ['x-component']?: string
  //组件属性
  ['x-component-props']?: any
  //组件响应器
  ['x-reactions']?: SchemaReactions<any>

  ['x-visible']?: boolean

  ['x-hidden']?: boolean

  ['x-disabled']?: boolean

  ['x-editable']?: boolean

  ['x-read-only']?: boolean

  ['x-read-pretty']?: boolean
}
