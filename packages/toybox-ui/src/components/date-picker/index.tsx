import { Dayjs } from 'dayjs'
import generateConfig from 'rc-picker/lib/generate/dayjs'
import generatePicker from 'antd/es/date-picker/generatePicker'
import 'antd/es/date-picker/style/index'

export const DatePicker: any = generatePicker<Dayjs>(generateConfig)
