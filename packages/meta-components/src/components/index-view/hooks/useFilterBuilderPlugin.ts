export interface IFilterBuilderPluginProps {
  get
}

export const useFilterBuilderPlugin = () => {
  return ({ app }) => {
    console.log('app', app)
    return {
      props: (pluginProps) => {
        console.log('pluginProps', pluginProps)
        return pluginProps
      },
    }
  }
}
