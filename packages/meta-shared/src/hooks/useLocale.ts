import LocaleContext from 'antd/lib/locale-provider/context'
import { useContext } from 'react'

const DefaultLocale = 'zh_CN'

export const useLocale = () => {
  const antLocale = useContext(LocaleContext)
  return antLocale && antLocale.locale ? antLocale.locale : DefaultLocale
}
