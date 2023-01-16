import { DLightNode } from './DlightNode';
import {DLNode} from './Node';
import { addDLProp } from '../utils/prop';
import { bindParentNode, initNodes } from '../utils/nodes';


export class EnvNode extends DLNode {
    _$depIds: string[] = []
    _$deps?: any
    _$envNodes?: EnvNode[]

    constructor(id?: string) {
        super("env", id)
    }

    _$addNode(dlNode: DLNode) {
        this._$dlNodes.push(dlNode)
    }

    _$addProp(key: string, propOrFunc: any | (() => any), dlScope?: DLightNode, listenDeps?: string[]) {
        // ---- 每一次加一个prop都相当于给底下所有的DlightNode加一个prop，其他类型的就遍历直到dlight就
        this.addNodesProp(this._$dlNodes, key, propOrFunc, dlScope, listenDeps)
    }

    addNodesProp(nodes: DLNode[], key: string, propOrFunc: any | (() => any), dlScope?: DLightNode, listenDeps?: string[]) {
        for (let node of nodes) {
            switch (node._$nodeType) {
                case "for":
                    for (let ns of node._$dlNodess) {
                        this.addNodesProp(ns, key, propOrFunc, dlScope, listenDeps)
                    }
                    break
                case "if":
                case "html":
                    this.addNodesProp(node._$dlNodes, key, propOrFunc, dlScope, listenDeps)
                    break
                case "dlight":
                    if ((node as any)[key] !== undefined) break
                    addDLProp(node as DLightNode, "env", key, propOrFunc, dlScope, listenDeps)
                    break
            }
        }
    }

    _$init() {
        bindParentNode(this._$dlNodes, this)
        initNodes(this._$nodes)
    }

    render(parentEl: HTMLElement) {
        for (let node of this._$dlNodes) {
            node.render(parentEl)
        }
    }
}

