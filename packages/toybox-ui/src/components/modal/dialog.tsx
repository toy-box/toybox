import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { getConfirmLocale } from 'antd/es/modal/locale'
import type { ModalFuncProps } from 'antd/es/modal/Modal'
import { globalConfig } from 'antd/es/config-provider'
import devWarning from 'antd/es/_util/devWarning'
import destroyFns from 'antd/es/modal/destroyFns'
import ConfirmDialog from './ConfirmDialog'

let defaultRootPrefixCls = ''

function getRootPrefixCls() {
  return defaultRootPrefixCls
}

type ConfigUpdate =
  | ModalFuncProps
  | ((prevConfig: ModalFuncProps) => ModalFuncProps)

export type ModalFunc = (props: ModalFuncProps) => {
  destroy: () => void
  update: (configUpdate: ConfigUpdate) => void
}

export type ModalStaticFunctions = Record<
  NonNullable<ModalFuncProps['type']>,
  ModalFunc
>

export function dialog(config: ModalFuncProps) {
  const container = document.createDocumentFragment()
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  let currentConfig = { ...config, close, visible: true } as any

  function destroy(...args: any[]) {
    ReactDOM.unmountComponentAtNode(container)
    const triggerCancel = args.some((param) => param && param.triggerCancel)
    if (config.onCancel && triggerCancel) {
      config.onCancel(...args)
    }
    for (let i = 0; i < destroyFns.length; i++) {
      const fn = destroyFns[i]
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      if (fn === close) {
        destroyFns.splice(i, 1)
        break
      }
    }
  }

  function render({
    okText,
    cancelText,
    prefixCls: customizePrefixCls,
    ...props
  }: any) {
    /**
     * https://github.com/ant-design/ant-design/issues/23623
     *
     * Sync render blocks React event. Let's make this async.
     */
    setTimeout(() => {
      const runtimeLocale = getConfirmLocale()
      const { getPrefixCls, getIconPrefixCls } = globalConfig()
      // because Modal.config  set rootPrefixCls, which is different from other components
      const rootPrefixCls = getPrefixCls(undefined, getRootPrefixCls())
      const prefixCls = customizePrefixCls || `${rootPrefixCls}-modal`
      const iconPrefixCls = getIconPrefixCls()

      ReactDOM.render(
        <ConfirmDialog
          {...props}
          prefixCls={prefixCls}
          rootPrefixCls={rootPrefixCls}
          iconPrefixCls={iconPrefixCls}
          okText={
            okText ||
            (props.okCancel ? runtimeLocale.okText : runtimeLocale.justOkText)
          }
          cancelText={cancelText || runtimeLocale.cancelText}
        />,
        container
      )
    })
  }

  function close(...args: any[]) {
    currentConfig = {
      ...currentConfig,
      visible: false,
      afterClose: () => {
        if (typeof config.afterClose === 'function') {
          config.afterClose()
        }
        destroy.apply(this, args)
      },
    }
    render(currentConfig)
  }

  function update(configUpdate: ConfigUpdate) {
    if (typeof configUpdate === 'function') {
      currentConfig = configUpdate(currentConfig)
    } else {
      currentConfig = {
        ...currentConfig,
        ...configUpdate,
      }
    }
    render(currentConfig)
  }

  render(currentConfig)

  destroyFns.push(close)

  return {
    destroy: close,
    update,
  }
}

export function modalGlobalConfig({
  rootPrefixCls,
}: {
  rootPrefixCls: string
}) {
  devWarning(
    false,
    'Modal',
    'Modal.config is deprecated. Please use ConfigProvider.config instead.'
  )
  defaultRootPrefixCls = rootPrefixCls
}
