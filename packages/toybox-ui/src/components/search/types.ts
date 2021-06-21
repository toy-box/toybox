import { CSSProperties, ReactNode } from 'react'

export interface SearchProps {
  type?: 'normal' | 'nav-search'
  addonAfter?: ReactNode
  autoFocus?: boolean
  defaultValue?: string
  value?: string | number
  onChange?: (value: string | number) => void
  onSearch?: (value: string | number) => void
  onClear?: () => void
  placeholder?: string
  allowClear?: boolean
  disabled?: boolean
}

export interface IconSearchProps extends SearchProps {
  searchClassName?: string
  direction?: 'ltr' | 'rtl'
  triggerTooltipProps?: string
  style?: CSSProperties
  className?: string
}
