(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = global || self, factory(global.jWebForm = {}));
}(this, function (exports) { 'use strict';

    class Control {
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

    class Button extends Control {
    }
    Button.tagName = 'button';
    regControl(Button);

    document.addEventListener('DOMContentLoaded', () => {
        InitControls();
    });
    function InitControls() {
        for (const [_, value] of Controls) {
            InitControl(document.querySelectorAll(`j${value.tagName}`), value);
        }
    }
    function InitControl(eles, ins) {
        for (const ele of eles) {
            const obj = new ins(ele);
            ele.$class = obj;
        }
    }
    class JWebForm {
        constructor(selector) {
            this.elements = JWebFormSelectorAll(selector);
        }
    }
    const $j = new Proxy(JWebForm, {
        apply(target, thisArg, argArray) {
            return new target(...argArray);
        }
    });
    function JWebFormSelectorAll(selectors) {
        const arr = [];
        const nodes = document.querySelectorAll(selectors);
        for (const node of nodes) {
            if (node.$class instanceof Control) {
                arr.push(node);
            }
        }
        return arr;
    }

    exports.$j = $j;
    exports.JWebForm = JWebForm;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
