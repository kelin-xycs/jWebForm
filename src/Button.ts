import { regControl, Control } from './Controls'

export class Button extends Control<HTMLDivElement> {
    static tagName = 'button'
    static rawTagName = 'div'

    protected _width: number = 200
    protected _height: number = 30
    protected _text: string = ''
    protected _click: (e: Event, o: this) => void
    protected textDiv: HTMLDivElement

    init(jele: Element): void {
        const width = jele.getAttribute("Width")
        const height = jele.getAttribute("Width")
        const text = jele.getAttribute("Text")
        const click = jele.getAttribute("OnClick")

        this.width = width
        this.height = height

        this.ele.style.boxSizing = "border-box"

        this.ele.className = "jwf_Button"

        this.ele.style.display = "inline-flex"
        this.ele.style.justifyContent = "center"
        this.ele.style.alignItems = "center"

        this.click = click
        this.ele.addEventListener("click", (e) => {
            if (this._click != null) {
                this._click.call(this, e)
            }
        })

        this.textDiv = document.createElement("div")

        this.textDiv.style.width = "fit-content";

        this.text = text

        this.ele.appendChild(this.textDiv)
    }

    get width() { return this._width }
    set width(width: number | string) {
        console.log(width)
        if (width != null)
            this._width = typeof width === 'number' ? width : parseInt(width.replace("px", ""))

        this.ele.style.width = `${this._width}px`
    }
    get height() { return this._width }
    set height(height: number | string) {
        if (height != null)
            this._height = typeof height === 'number' ? height : parseInt(height.replace("px", ""))

        this.ele.style.height = `${this._height}px`
    }

    get text() { return this._text }
    set text(text: string) {
        this._text = text;
        this.textDiv.innerHTML = text;
    }

    get click() { return this._click }
    set click(click: string | ((e: Event, o: this) => void)) {
        if (typeof click === "string") {
            this._click = window[click]
        }
        else if (typeof click == "function") {
            this._click = click
        }

        if (this._click == null) {
            throw `jWebForm Error: "${click}" 不是有效的 函数名 或 函数 。`
        }
    }
}
regControl(Button)