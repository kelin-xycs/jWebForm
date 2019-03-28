import { Controls, IControl, Control } from './Controls'
import './Button'

document.addEventListener('DOMContentLoaded', () => {
    InitControls()
})

function InitControls() {
    for (const [_, value] of Controls) {
        InitControl(document.querySelectorAll(`j${value.tagName}`), value)
    }
}
function InitControl(eles: NodeListOf<Element>, ins: IControl) {
    for (const ele of eles) {
        const obj = new ins(ele);
        (ele as any).$class = obj
    }
}

export interface JWebForm {
    (selector: string): JWebForm
}
export class JWebForm {
    elements: Element[]
    constructor(selector: string) {
        this.elements = JWebFormSelectorAll(selector)
    }
}
export const $j = new Proxy(JWebForm, {
    apply(target, thisArg, argArray: Parameters<JWebForm>) {
        return new target(...argArray)
    }
})
export namespace $j {
    
}

function JWebFormSelectorAll(selectors: string): Element[] {
    const arr = []
    const nodes = document.querySelectorAll(selectors)
    for (const node of nodes) {
        if ((node as any).$class instanceof Control) {
            arr.push(node)
        }
    }
    return arr
}