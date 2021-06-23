import React, {
  FC,
  CSSProperties,
  ReactNode,
  useCallback,
  useState,
} from 'react'
import classNames from 'classnames'
import CSSMotion from 'rc-motion'
import collapseMotion from 'antd/lib/_util/motion'
import { ArrowDownSLine, ArrowUpSLine } from '@airclass/icons'
import { Button } from '../button'

import './styles'

export interface ISegmentProps {
  title: ReactNode
  className?: string
  style?: CSSProperties
  collapsible?: boolean
  empty?: ReactNode
}

export const Segment: FC<ISegmentProps> = ({
  title,
  className,
  style,
  collapsible,
  empty,
  children,
}) => {
  const [collapse, setCollapse] = useState(false)
  const handleCollapse = useCallback(
    () => collapsible && setCollapse(!collapse),
    [collapse, setCollapse]
  )
  const prefixCls = 'tbox-segment'

  const Toggle = useCallback(() => {
    return (
      <Button.Icon
        icon={collapse ? <ArrowUpSLine /> : <ArrowDownSLine />}
        onClick={handleCollapse}
        circle
      />
    )
  }, [collapse])

  return (
    <div className={classNames(prefixCls, className)} style={style}>
      <div className={`${prefixCls}-header`}>
        <div className={`${prefixCls}-header__title`}>{title}</div>
        <div className={`${prefixCls}-header__extend`}>
          {collapsible && <Toggle />}
        </div>
      </div>
      <CSSMotion
        visible={!collapse}
        removeOnLeave={false}
        leavedClassName={`${prefixCls}-content--hidden`}
        motionAppear={false}
        {...collapseMotion}
      >
        {({ className, style }, ref) => (
          <div
            ref={ref}
            className={classNames(`${prefixCls}-content`, className)}
            style={style}
          >
            {children || empty}
          </div>
        )}
      </CSSMotion>
    </div>
  )
}
