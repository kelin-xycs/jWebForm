(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.jWebForm = {}));
}(this, function (exports) { 'use strict';

    class Control {
        constructor(jele, tagName) {
            this.ele = document.createElement(tagName);
            const id = jele.getAttribute("id");
            if (id != null)
                this.ele.id = id;
            this.init(jele);
            jele.parentNode.replaceChild(this.ele, jele);
        }
    }
    const Controls = new Map();
    function regControl(control) {
        if (Controls.has(control.tagName)) {
            throw `不能重复注册控件: ${control.tagName}`;
        }
        else {
            Controls.set(control.tagName, control);
        }
    }
    //# sourceMappingURL=Controls.js.map

    class Button extends Control {
        constructor() {
            super(...arguments);
            this._width = 200;
            this._height = 30;
            this._text = '';
        }
        init(jele) {
            const width = jele.getAttribute("Width");
            const height = jele.getAttribute("Width");
            const text = jele.getAttribute("Text");
            const click = jele.getAttribute("OnClick");
            this.width = width;
            this.height = height;
            this.ele.style.boxSizing = "border-box";
            this.ele.className = "jwf_Button";
            this.ele.style.display = "inline-flex";
            this.ele.style.justifyContent = "center";
            this.ele.style.alignItems = "center";
            this.click = click;
            this.ele.addEventListener("click", (e) => {
                if (this._click != null) {
                    this._click.call(this, e);
                }
            });
            this.textDiv = document.createElement("div");
            this.textDiv.style.width = "fit-content";
            this.text = text;
            this.ele.appendChild(this.textDiv);
        }
        get width() { return this._width; }
        set width(width) {
            console.log(width);
            if (width != null)
                this._width = typeof width === 'number' ? width : parseInt(width.replace("px", ""));
            this.ele.style.width = `${this._width}px`;
        }
        get height() { return this._width; }
        set height(height) {
            if (height != null)
                this._height = typeof height === 'number' ? height : parseInt(height.replace("px", ""));
            this.ele.style.height = `${this._height}px`;
        }
        get text() { return this._text; }
        set text(text) {
            this._text = text;
            this.textDiv.innerHTML = text;
        }
        get click() { return this._click; }
        set click(click) {
            if (typeof click === "string") {
                this._click = window[click];
            }
            else if (typeof click == "function") {
                this._click = click;
            }
            if (this._click == null) {
                throw `jWebForm Error: "${click}" 不是有效的 函数名 或 函数 。`;
            }
        }
    }
    Button.tagName = 'button';
    Button.rawTagName = 'div';
    regControl(Button);
    //# sourceMappingURL=Button.js.map

    window.addEventListener('DOMContentLoaded', () => {
        InitControls();
    });
    function InitControls() {
        for (const [_, value] of Controls) {
            InitControl(document.getElementsByTagName(`j:${value.tagName}`), value);
        }
    }
    function InitControl(eles, ins) {
        const arr = [];
        for (const ele of eles) {
            arr.push(ele);
        }
        arr.map(ele => () => {
            const obj = new ins(ele, ins.rawTagName);
            obj.ele.$jwfObj = obj;
        }).forEach(f => f());
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
    function $j(selector) {
        return JWebFormSelectorFirst(selector);
    }
    window.$j = $j;
    function JWebFormSelectorFirst(selectors) {
        const nodes = document.querySelectorAll(selectors);
        for (const node of nodes) {
            if (node.$jwfObj instanceof Control) {
                return node;
            }
        }
    }

    exports.$j = $j;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
