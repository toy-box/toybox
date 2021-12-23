import { Modal as OrgModal, ModalFuncProps } from 'antd'
import { ModalFunc } from 'antd/es/modal/confirm'
import { dialog } from './dialog'

type ModalType = typeof OrgModal & {
  dialog: ModalFunc
}

export const Modal = OrgModal as ModalType

Modal.dialog = function dialogFn(props: ModalFuncProps) {
  return dialog(props)
}

export * from './hooks'

export * from './DialogContext'
