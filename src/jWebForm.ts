import { Controls, IControl, Control } from './Controls'
import './Button'

window.addEventListener('load', () => {
    InitControls()
})

function InitControls() {
    for (const [_, value] of Controls) {
        InitControl(document.getElementsByTagName(`j:${value.tagName}`), value)
    }
}
function InitControl(eles: HTMLCollectionOf<Element>, ins: IControl<any>) {
    const arr = []
    for (const ele of eles) {
        arr.push(ele)
    }
    arr.map(ele => () => {
        const obj = new ins(ele, ins.rawTagName);
        (ele as any).$jwfObj = obj
    }).forEach(f => f())
}

// export interface JWebForm {
//     (selector: string): JWebForm
// }
// export class JWebForm {
//     elements: Element[]
//     constructor(selector: string) {
//         this.elements = JWebFormSelectorAll(selector)
//     }
// }
// export const $j = new Proxy(JWebForm, {
//     apply(target, thisArg, argArray: Parameters<JWebForm>) {
//         return new target(...argArray)
//     }
// })
export function $j(selector: string) {
    return JWebFormSelectorFirst(selector)
}
export namespace $j {
    
}

function JWebFormSelectorFirst(selectors: string): Element {
    const nodes = document.querySelectorAll(selectors)
    for (const node of nodes) {
        if ((node as any).$jwfObj instanceof Control) {
            return node
        }
    }
}

function JWebFormSelectorAll(selectors: string): Element[] {
    const arr = []
    const nodes = document.querySelectorAll(selectors)
    for (const node of nodes) {
        if ((node as any).$jwfObj instanceof Control) {
            arr.push(node)
        }
    }
    return arr
}