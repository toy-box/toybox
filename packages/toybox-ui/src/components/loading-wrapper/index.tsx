import React, { CSSProperties, FC, useMemo } from 'react'
import { Spin } from 'antd'
import './style.less'

export interface ILoadingWrapperProps {
  size?: 'small' | 'default' | 'large'
  loading: boolean
  indicator?: React.ReactElement<HTMLElement>
  height?: number
}

export const LoadingWrapper: FC<
  React.PropsWithChildren<ILoadingWrapperProps>
> = ({ size, loading, indicator, height = 200, children }) => {
  const style: CSSProperties = useMemo(
    () => ({
      height: `${height}px`,
      paddingTop: `${height / 2 - 40}px`,
    }),
    []
  )
  return (
    <React.Fragment>
      {loading ? (
        <div className="loading-wrapper" style={style}>
          <Spin size={size} indicator={indicator} />
        </div>
      ) : (
        children
      )}
    </React.Fragment>
  )
}
