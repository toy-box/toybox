import React, { FC, ReactNode, useCallback, useRef } from 'react'
import GridLayout from 'react-grid-layout'
import { useDebounceFn, useSize } from 'ahooks'
import { FreeGridContext } from './context'
import { FreeGridItem, Background } from './components'

import './styles'

export interface ISimpleLayout {
  i?: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  maxW?: number
  minH?: number
  maxH?: number
  static?: boolean
}

export interface IGridItem {
  key: string
  itemProps?: Record<string, any>
  itemRender: (props: Record<string, any>) => ReactNode
  layout?: GridLayout.Layout
}

export interface ILayoutType extends GridLayout.Layout {
  item: IGridItem
}

export interface IFreeGridProps {
  cols: number
  width: number
  rowHeight: number
  layout: ILayoutType[]
  editable?: boolean
  onChange?: (layout: ILayoutType[]) => void
  removeItem?: (key: string) => void
  gridItemClass?: string
}

export const FreeGrid: FC<IFreeGridProps> = ({
  cols,
  width,
  rowHeight,
  layout,
  onChange,
  editable,
  gridItemClass,
  removeItem,
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const size = useSize(ref)
  const { run } = useDebounceFn(
    (newLayout: GridLayout.Layout[]) => {
      if (typeof onChange === 'function') {
        onChange(
          newLayout.map((nl) => {
            const l = layout.find((l) => l.i === nl.i)
            return { ...nl, item: l?.item } as ILayoutType
          })
        )
      }
    },
    {
      wait: 1000,
    }
  )

  const onLayoutChange = useCallback(
    (layout: GridLayout.Layout[]) => {
      run(layout)
    },
    [run]
  )

  return (
    <FreeGridContext.Provider value={{ removeItem }}>
      <div className="tbox-free-grid">
        <div className="gird">
          {editable && (
            <Background
              cols={cols}
              width={width}
              height={size.height}
              rowHeight={rowHeight}
            />
          )}
        </div>
        <GridLayout
          className="free-layout"
          layout={layout}
          onLayoutChange={onLayoutChange}
          cols={cols}
          rowHeight={rowHeight}
          width={width}
        >
          {layout.map((itemLayout) => {
            const { item } = itemLayout
            return item ? (
              <div key={itemLayout.i}>
                <FreeGridItem
                  itemProps={item.itemProps}
                  itemKey={item.key}
                  itemRender={item.itemRender}
                  editable={editable}
                  className={gridItemClass}
                />
              </div>
            ) : undefined
          })}
        </GridLayout>
      </div>
    </FreeGridContext.Provider>
  )
}
