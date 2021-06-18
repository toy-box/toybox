import {
  OptionData,
  OptionGroupData,
  OptionsType,
} from 'rc-select/lib/interface'

export declare type OptionItem = OptionData | OptionGroupData

export declare type OptionItemsType = OptionsType

export declare type OptionReturnType =
  | OptionsType
  | OptionData
  | OptionGroupData

export declare type SelectValue = React.ReactText | React.ReactText[]
