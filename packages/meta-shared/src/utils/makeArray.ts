export const makeArray = (item: any | any[]) => {
  if (Array.isArray(item)) {
    return item
  }
  return [item]
}
