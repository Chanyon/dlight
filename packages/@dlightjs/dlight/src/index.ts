import { CustomNode } from "./Nodes"

export * from "./Nodes"
export * from "./utils/nodes"

const View = CustomNode as any

function render(idOrEl: string | HTMLElement, dl: any) {
    new dl().render(idOrEl)
}

export {View, render}
