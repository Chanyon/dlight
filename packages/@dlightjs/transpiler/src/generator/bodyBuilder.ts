import {ParserNode} from "../parser/ParserNode";

export function isHTMLTag(parserNode: ParserNode) {
    const tag = parserNode.tag
    const htmlReg = /html\((.+)\)/
    if (htmlReg.test(parserNode.tag)) {
        parserNode.tag = parserNode.tag.replace(htmlReg, "$1")
        return true
    }
    if (/^[a-z][a-z0-9]*$/.test(tag)) {
        parserNode.tag = `"${parserNode.tag}"`
        return true
    }
    return false
}


export function newLine(value: string) {
    return `${value}\n`
}


export function geneChildNodesArray(parserNodes: ParserNode[]) {
    return "[" + parserNodes.map((_: any, idx: number)=>`_$node${idx}`).join(", ") + "]"
}

export class BodyStringBuilder {
    value: string = ""
    
    add(value: string) {
        this.value += newLine(value)
    }

    shift(value: string) {
        this.value = newLine(value) + this.value
    }

    addBody(body: BodyStringBuilder) {
        this.value += body.value
    }
    
}