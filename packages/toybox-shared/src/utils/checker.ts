const isType =
  <T>(type: string | string[]) =>
  (obj: unknown): obj is T =>
    getType(obj) === `[object ${type}]`
export const getType = (obj: any) => Object.prototype.toString.call(obj)
export const isFn = (val: any): val is Function => typeof val === 'function'
export const isArr = Array.isArray
export const isPlainObj = isType<object>('Object')
export const isStr = isType<string>('String')
export const isBool = isType<boolean>('Boolean')
export const isNum = isType<number>('Number')
export const isMap = (val: any): val is Map<any, any> =>
  val && val instanceof Map
export const isSet = (val: any): val is Set<any> => val && val instanceof Set
export const isWeakMap = (val: any): val is WeakMap<any, any> =>
  val && val instanceof WeakMap
export const isWeakSet = (val: any): val is WeakSet<any> =>
  val && val instanceof WeakSet
export const isNumberLike = (index: any): index is number =>
  isNum(index) || /^\d+$/.test(index)
export const isObj = (val: unknown): val is object => typeof val === 'object'
export const isRegExp = isType<RegExp>('RegExp')
export const isReactElement = (obj: any): boolean =>
  obj && obj['$$typeof'] && obj['_owner']
export const isHTMLElement = (target: any): target is EventTarget => {
  return Object.prototype.toString.call(target).indexOf('HTML') > -1
}
export const instOf = (value: any, cls: any) => {
  if (isFn(cls)) return value instanceof cls
  if (isStr(cls)) return window[cls] ? value instanceof window[cls] : false
  return false
}
export const isNumberIndex = (val: any) =>
  isStr(val) ? /^\d+$/.test(val) : isNum(val)
