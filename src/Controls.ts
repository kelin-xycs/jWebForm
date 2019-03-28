type getEleKeyType<E extends Element, K extends keyof HTMLElementTagNameMap> = E extends HTMLElementTagNameMap[K] ? K : any
type getEleType<E extends Element> = getEleKeyType<E, keyof HTMLElementTagNameMap>
export abstract class Control<E extends Element> {
    ele: E
    constructor(jele: Element, tagName: getEleType<E>) {
        this.ele = document.createElement(tagName)
        this.init(jele)
        jele.parentNode.replaceChild(this.ele, jele);
    }

    abstract init(jele?: Element): void
}
export interface IControl<E extends Element> {
    new(ele: E, tagName: getEleType<E>): Control<E>
    tagName: string
    rawTagName: string
}

export const Controls = new Map<string, IControl<any>>()

export function regControl(control: IControl<any>) {
    if (Controls.has(control.tagName)) {
        throw `不能重复注册控件: ${control.tagName}`
    } else {
        Controls.set(control.tagName, control)
    }
}