import * as React from 'react'
import classNames from 'classnames'
import Dialog, { ModalFuncProps } from 'antd/es/modal/Modal'
import devWarning from 'antd/es/_util/devWarning'
import ConfigProvider from 'antd/es/config-provider'
import { getTransitionName } from 'antd/es/_util/motion'
import { DialogContext } from './DialogContext'

interface ConfirmDialogProps extends ModalFuncProps {
  afterClose?: () => void
  close: (...args: any[]) => void
  autoFocusButton?: null | 'ok' | 'cancel'
  rootPrefixCls: string
  iconPrefixCls?: string
  wrapClassName?: string
  content: (...args: any[]) => React.ReactNode
}

const ConfirmDialog = (props: ConfirmDialogProps) => {
  const {
    icon,
    close,
    zIndex,
    afterClose,
    visible,
    keyboard,
    centered,
    getContainer,
    maskStyle,
    direction,
    prefixCls,
    rootPrefixCls,
    iconPrefixCls,
    bodyStyle,
    closable,
    closeIcon,
    modalRender,
    focusTriggerAfterClose,
    wrapClassName,
    title,
  } = props

  devWarning(
    !(typeof icon === 'string' && icon.length > 2),
    'Modal',
    `\`icon\` is using ReactNode instead of string naming in v4. Please check \`${icon}\` at https://ant.design/components/icon`
  )

  // 支持传入{ icon: null }来隐藏`Modal.confirm`默认的Icon
  // const okType = props.okType || 'primary';
  // 默认为 true，保持向下兼容
  const width = props.width || 520
  const style = props.style || {}
  const mask = props.mask === undefined ? true : props.mask
  // 默认为 false，保持旧版默认行为
  const maskClosable =
    props.maskClosable === undefined ? false : props.maskClosable

  const wrapClassNameExtended = classNames(wrapClassName, {
    [`${prefixCls}-centered`]: !!centered,
    [`${prefixCls}-wrap-rtl`]: direction === 'rtl',
  })

  return (
    <ConfigProvider
      prefixCls={rootPrefixCls}
      iconPrefixCls={iconPrefixCls}
      direction={direction}
    >
      <DialogContext.Provider value={{ close }}>
        <Dialog
          prefixCls={prefixCls}
          wrapClassName={wrapClassNameExtended}
          onCancel={() => close({ triggerCancel: true })}
          visible={visible}
          title={title}
          footer=""
          transitionName={getTransitionName(
            rootPrefixCls,
            'zoom',
            props.transitionName
          )}
          maskTransitionName={getTransitionName(
            rootPrefixCls,
            'fade',
            props.maskTransitionName
          )}
          mask={mask}
          maskClosable={maskClosable}
          maskStyle={maskStyle}
          style={style}
          bodyStyle={bodyStyle}
          width={width}
          zIndex={zIndex}
          afterClose={afterClose}
          keyboard={keyboard}
          centered={centered}
          getContainer={getContainer}
          closable={closable}
          closeIcon={closeIcon}
          modalRender={modalRender}
          focusTriggerAfterClose={focusTriggerAfterClose}
        >
          {props.content({ close })}
        </Dialog>
      </DialogContext.Provider>
    </ConfigProvider>
  )
}

export default ConfirmDialog
