export class Control {
    
}
export interface IControl {
    new(ele: Element): Control
    tagName: string
}

export const Controls = new Map<string, IControl>()

export function regControl(control: IControl) {
    if (Controls.has(control.tagName)) {
        throw `不能重复注册控件: ${control.tagName}`
    } else {
        Controls.set(control.tagName, control)
    }
}