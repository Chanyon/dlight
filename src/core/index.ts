import { HtmlNode } from "./Nodes"
import { DLightNode } from "./Nodes/DlightNode"

export * from "./Nodes"

export const View = DLightNode

export {listen} from "./Nodes/ForNode"


export function render(selectName: string, dl: DLightNode) {
    const appNode = new HtmlNode("div")
    appNode._$addNode(dl)
    appNode._$addProp("id", selectName)
    appNode._$init()
    document.querySelector(selectName)!.replaceWith(appNode._$el)
}