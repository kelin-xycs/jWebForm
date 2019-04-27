(
    function()
    {

        $j.RegisterControlType("J:CONTEXTMENU", ContextMenu);

        function ContextMenu(contentElement)
        {

            var elemt = document.createElement("div");

            this.elemt = elemt;
            
            elemt.style.position = "absolute";
            elemt.style.zIndex = 102;

            elemt.setAttribute("oncontextmenu", "return false;");

            this.contentElement = contentElement;

            var ctrl = this;

            elemt.addEventListener("mousedown",
                function drop_mousedown()
                {
                    ctrl.isMouseDownSelf = true;
                }
            );

            $j.addEventListener("mousedown", function window_mousedown() {
                if (ctrl.isMouseDownSelf) {
                    ctrl.isMouseDownSelf = false;
                    return;
                }

                ctrl.Close();
            });

        }

        window.$j.ContextMenu = function CreateContextMenu(contentElement) {

            return new ContextMenu(contentElement);

        }

        ContextMenu.prototype = $j.Control();

        ContextMenu.prototype.Show = function Show(clientX, clientY) {

            var elemt = this.elemt;

            if (!this.contentElement)
                throw "应为 ContextMenu 指定 contentElement ，通过 $j.ContextMenu( contentElement ) 方法参数指定 。";

            elemt.appendChild(this.contentElement);

            var x = clientX + document.body.scrollLeft;
            var y = clientY + document.body.scrollTop;

            elemt.style.left = x;
            elemt.style.top = y;

            document.documentElement.appendChild(elemt);

            this.isClosed = false;
        }

        ContextMenu.prototype.Close = function Close() {

            if (this.isClosed)
                return;

            document.documentElement.removeChild(this.elemt);

            this.isClosed = true;
        }
        
    }
)();