import { regControl, Control } from './Controls'

export class Button extends Control {
    static tagName = 'button'
}
regControl(Button)