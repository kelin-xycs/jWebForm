(
    function ()
    {
        $j.RegisterControlType("J:DROPMENU", DropMenu)

        function DropMenu(jelemt) {
            var elemt = document.createElement("div");

            elemt.style.display = "inline-block";

            elemt.style.cursor = "default";

            this.elemt = elemt;
            elemt.jwfObj = this;
        }

        $j.DropMenu = function CreateDropMenu(id) {
            var ctrl = new DropMenu();

            if (id) {
                $j.RegisterControl(ctrl, id);
            }

            return ctrl;
        }

        DropMenu.prototype = $j.Control();

        DropMenu.prototype.AddTopItem = function AddTopItem(topItem) {
            if (!topItem instanceof TopItem)
                throw "参数 topItem 不是 TopItem 对象，应使用 $j.DropMenu.TopItem() 方法创建 TopItem 。";

            var elemt = this.elemt;

            elemt.appendChild(topItem.div);

            topItem.menu = this;
        }

        function TopItem(text) {
            var div = document.createElement("div");

            div.style.display = "inline-block";
            div.style.paddingLeft = "5px";
            div.style.paddingRight = "5px";
            div.style.position = "relative";

            this.div = div;
            div.jwfObj = this;

            var textDiv = document.createElement("div");
            textDiv.className = "jwf_DropMenu_TopItem";
            textDiv.innerText = text;

            div.appendChild(textDiv);

            var drop = document.createElement("div");

            drop.style.display = "none";
            drop.style.padding = "1px";
            drop.style.border = "solid 1px gray";
            drop.style.backgroundColor = "white";
            drop.style.position = "absolute";
            drop.style.zIndex = 1;
            drop.style.whiteSpace = "nowrap";

            div.appendChild(drop);

            this.drop = drop;
            drop.jwfObj = this;

            textDiv.addEventListener("mousedown", function TopItem$textDiv_mousedown() {
                drop.style.display = "block";

                drop.jwfObj.menu.currentOpenDrop = drop;
            });

            textDiv.addEventListener("mouseover", function TopItem$textDiv_mouseover() {
                var menu = drop.jwfObj.menu;

                if (menu.currentOpenDrop && menu.currentOpenDrop != drop) {
                    menu.currentOpenDrop.style.display = "none";
                    drop.style.display = "block";
                    menu.currentOpenDrop = drop;
                }
            })

            div.addEventListener("mousedown", function TopItem$div_mousedown() {
                div.jwfObj.mousedownSelf = true;
            });

            //$j.AddEventHandler_To_Frames_Window_MouseDown(function window_mousedown() {
            $j.addEventListener("mousedown", function window_mousedown() {
                if (drop.jwfObj.mousedownSelf) {
                    drop.jwfObj.mousedownSelf = false;
                    return;
                }

                drop.style.display = "none";

                var menu = drop.jwfObj.menu;

                if (menu.currentOpenDrop && menu.currentOpenDrop == drop) {
                    drop.jwfObj.menu.currentOpenDrop = null;
                }
            });

            /* 
             * 用 jwf$AddEventHandler_To_Frames_Window_MouseDown() 替换 window.addEventListener() 的 原因 见
             * jwf$AddEventHandler_To_Frames_Window_MouseDown() 及 相关方法和变量 的 注释 
             */
            //window.addEventListener("mousedown", function jwf$DropMenu$window_mousedown() {
            //    if (drop.jwfObj.mousedownSelf) {
            //        drop.jwfObj.mousedownSelf = false;
            //        return;
            //    }

            //    drop.style.display = "none";
            //});
        }

        $j.DropMenu.TopItem = function (text) {
            return new TopItem(text);
        }

        TopItem.prototype.AddSubItem = function AddSubItem(subItem) {
            if (!subItem instanceof SubItem)
                throw "参数 subItem 不是 SubItem 对象，应使用 $j.DropMenu.SubItem() 方法创建 SubItem 。";

            var drop = this.drop;

            subItem.drop = drop;

            drop.appendChild(subItem.div);
        }

        function SubItem(text, click) {
            var div = document.createElement("div");

            div.style.paddingLeft = "5px";
            div.style.paddingRight = "5px";
            div.className = "jwf_DropMenu_SubItem";

            div.innerText = text;

            this.div = div;
            div.jwfObj = this;

            var subItem = this;

            div.addEventListener("click", function SubItem$div_click() {
                var drop = subItem.drop;

                if (drop)
                    drop.style.display = "none";

                var menu = drop.jwfObj.menu;

                if (menu.currentOpenDrop && menu.currentOpenDrop == drop) {
                    drop.jwfObj.menu.currentOpenDrop = null;
                }

                if (click)
                    click(subItem);
            });
        }

        $j.DropMenu.SubItem = function (text, click) {
            return new SubItem(text, click);
        }
    }
)();
