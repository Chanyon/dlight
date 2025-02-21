import { View } from "@dlightjs/dlight"
import { css } from "@emotion/css"
import { html, tag } from "@dlightjs/types"

export const styled: any = (innerTag: any) => <T=any>(strings: any, ...args: any) => {
  const getStyles = (node: any, scope: any) => {
    const keys = [...new Set(
      Object.getOwnPropertyNames(scope)
          .filter(m => scope[m] === "_$prop")
          .map(m => m.replace(/^_\$*/, ""))
    )]
    node._$addProp("className", () => {
      const thisObject: T = {} as T
      for (let key of keys) {
          thisObject[key] = scope[`_$$${key}`]
      }
      let style = ""
      const strLength = Math.max(strings.length, args.length)
      for (let i of [...Array(strLength).keys()]) {
        if (strings[i]) style += strings[i]
        if (args[i]) {
          if (typeof args[i] === 'function') {
            style += args[i](thisObject)
          } else {
            style += args[i]
          }
        }
      }
      return css`${style}`
    }, scope, keys)
  }
  if (typeof innerTag === "string") {
    return class Styled extends View {
      _$forwardProps = true
  
      Afterset() {
        (this as any)._$el =  (this as any)._$el[0]
      }
      Body() {
        // @ts-expect-error
        html(innerTag)(this._$content)
          .forwardProps()
          .do((node: any) => getStyles(node, this))
      }
    } as any
  }
  return class Styled extends View {
    _$forwardProps = true

    Body() {
      tag(innerTag)()
        .forwardProps()
        .do((node: any) => getStyles(node, this))
    }
  } as any
} 

