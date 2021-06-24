import React, { ReactNode, useMemo } from 'react'
import { Tooltip } from 'antd'
import classNames from 'classnames'
import '../styles'

export type IconType = 'primary' | 'danger' | 'default'
export type SizeType = 'small' | 'medium' | 'large'
type Loading = number | boolean

export interface IconButtonProps {
  icon: ReactNode
  color?: string
  pure?: boolean
  type?: IconType
  tooltip?: string
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  disabled?: boolean
  size?: SizeType
  circle?: boolean
  loading?: boolean
  className?: string
}

const IconButton: React.ForwardRefRenderFunction<unknown, IconButtonProps> = (
  {
    icon,
    color,
    type = 'default',
    pure,
    tooltip,
    onClick,
    disabled,
    size,
    loading = false,
    circle,
    className,
  },
  ref
) => {
  const buttonRef = (ref as any) || React.createRef<HTMLElement>()
  const [innerLoading, setLoading] = React.useState<Loading>(!!loading)

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement, MouseEvent>
  ) => {
    if (innerLoading) {
      return
    }
    if (onClick) {
      ;(
        onClick as React.MouseEventHandler<
          HTMLButtonElement | HTMLAnchorElement
        >
      )(e)
    }
  }

  let sizeCls = ''
  switch (size) {
    case 'large':
      sizeCls = 'lg'
      break
    case 'small':
      sizeCls = 'sm'
      break
    default:
      break
  }

  const classes = classNames(
    className,
    'tbox-icon-button',
    `tbox-icon-button-${type}`,
    {
      [`tbox-icon-button-${sizeCls}`]: sizeCls,
      disabled,
      circle,
      pure,
    }
  )

  const style = useMemo(
    () => ({
      color,
    }),
    []
  )

  return tooltip ? (
    <Tooltip title={tooltip}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        className={classes}
        style={style}
      >
        {icon}
      </button>
    </Tooltip>
  ) : (
    <button
      ref={buttonRef}
      type="button"
      onClick={handleClick}
      className={classes}
      style={style}
    >
      {icon}
    </button>
  )
}

export default React.forwardRef<unknown, IconButtonProps>(IconButton)