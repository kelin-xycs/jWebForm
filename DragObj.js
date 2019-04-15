(
    function ()
    {
        window.$j.DragObj = function CreateDragObj(contentElement, width, height)
        {
            return new DragObj(contentElement, width, height);
        }

        function DragObj(contentElement)
        {

            var elemt = document.createElement("div");

            elemt.style.position = "absolute";
            elemt.style.top = "100px";
            elemt.style.left = "200px";
            elemt.style.width = "200px";
            elemt.style.height = "150px";
            elemt.style.padding = "5px";
            elemt.style.zIndex = _defaultZIndex;
            elemt.style.boxSizing = "border-box";


            var ctrl = this;

            elemt.addEventListener("mousedown",
                function ()
                {
                    draggingDiv_mousedown(ctrl);
                });

            elemt.addEventListener("mousemove",
                function ()
                {
                    div_mousemoveForResize(ctrl);
                });

            this.elemt = elemt;
            elemt.jwfObj = this;

            this.contentElement = contentElement;

        }


        var _draggingDiv = null;
        var _offX = 0;
        var _offY = 0;
        var _defaultZIndex = 50;
        var _draggingZIndex = 100;

        var _resizingDiv = null;

        
        function draggingDiv_mousedown( ctrl )
        {
            

            var e = window.event;

            var div = ctrl.elemt;


            //  判断鼠标是否在 div 边缘可调整大小的位置。 
            //  这个在 div 的 mousemove 事件里会判断，但是有可能上一次用鼠标调整大小后鼠标未移动又继续点击，此时应该能继续调整大小，
            //  所以需要在 鼠标 点击 时也判断鼠标是否在 div 边缘可调整大小的位置
            div_mousemoveForResize(ctrl);


            if (div.canResize)
            {
                div.resizeOriginalOffsetWidth = div.offsetWidth;
                div.resizeOriginalOffsetHeight = div.offsetHeight;
                div.resizeOriginalOffsetLeft = div.offsetLeft;
                div.resizeOriginalOffsetTop = div.offsetTop;
                div.resizeMouseOriginalX = e.clientX;
                div.resizeMouseOriginalY = e.clientY;

                _resizingDiv = div;

                window.addEventListener("mousemove", window_mousemoveForResize);
                window.addEventListener("mouseup", window_mouseupForResize);

                document.documentElement.setAttribute("onselectstart", "return false;");

                return;
            }


            if (ctrl.isNotDrag == true)
            {
                ctrl.isNotDrag = false;
                return;
            }

            if (_draggingDiv != null)
                _draggingDiv.style.zIndex = _defaultZIndex;

            div.style.zIndex = _draggingZIndex;

            _draggingDiv = div;
            
            _offX = e.clientX - div.offsetLeft;
            _offY = e.clientY - div.offsetTop;

            window.addEventListener("mouseup", window_mouseup);
            window.addEventListener("mousemove", window_mousemove);

            document.documentElement.setAttribute("onselectstart", "return false;");
        }

        function window_mouseup() {

            window.removeEventListener("mouseup", window_mouseup);
            window.removeEventListener("mousemove", window_mousemove);

            document.documentElement.removeAttribute("onselectstart");
        }

        function window_mousemove() {
            
            var e = window.event;
            var div = _draggingDiv;

            div.style.position = "absolute";
            div.style.top = (e.clientY - _offY) + "px";
            div.style.left = (e.clientX - _offX) + "px";

            //document.selection.empty();
            //_txtFocusForNoSelection.focus();
            //div.focus();
        }

        function window_mouseupForResize()
        {
            var div = _resizingDiv;

            div.canResize = false;
            div.resizeOrientation = "";

            _resizingDiv = null;

            window.removeEventListener("mousemove", window_mousemoveForResize);
            window.removeEventListener("mouseup", window_mouseupForResize);

            document.documentElement.removeAttribute("onselectstart");
        }

        function window_mousemoveForResize()
        {
            
            var div = _resizingDiv;

            var e = window.event;

            if (div.resizeOrientation == "RightBottom") {
                div.style.width = (div.resizeOriginalOffsetWidth + (e.clientX - div.resizeMouseOriginalX)) + "px";
                div.style.height = (div.resizeOriginalOffsetHeight + (e.clientY - div.resizeMouseOriginalY)) + "px";
            }
            else if (div.resizeOrientation == "LeftTop") {
                div.style.width = (div.resizeOriginalOffsetWidth - (e.clientX - div.resizeMouseOriginalX)) + "px";
                div.style.height = (div.resizeOriginalOffsetHeight - (e.clientY - div.resizeMouseOriginalY)) + "px";
                div.style.left = (div.resizeOriginalOffsetLeft + (div.resizeOriginalOffsetWidth - div.offsetWidth)) + "px";
                div.style.top = (div.resizeOriginalOffsetTop + (div.resizeOriginalOffsetHeight - div.offsetHeight)) + "px";

                //div.style.left = (div.resizeOriginalOffsetLeft + (e.clientX - div.resizeMouseOriginalX)) + "px";
                //div.style.top = (div.resizeOriginalOffsetTop + (e.clientY - div.resizeMouseOriginalY)) + "px";
            }
            else if (div.resizeOrientation == "LeftBottom") {
                div.style.width = (div.resizeOriginalOffsetWidth - (e.clientX - div.resizeMouseOriginalX)) + "px";
                div.style.height = (div.resizeOriginalOffsetHeight + (e.clientY - div.resizeMouseOriginalY)) + "px";
                div.style.left = (div.resizeOriginalOffsetLeft + (div.resizeOriginalOffsetWidth - div.offsetWidth)) + "px";
                //div.style.top = (div.resizeOriginalOffsetTop + (e.clientY - div.resizeMouseOriginalY)) + "px";
            }
            else if (div.resizeOrientation == "RightTop") {
                div.style.width = (div.resizeOriginalOffsetWidth + (e.clientX - div.resizeMouseOriginalX)) + "px";
                div.style.height = (div.resizeOriginalOffsetHeight - (e.clientY - div.resizeMouseOriginalY)) + "px";
                //div.style.left = (div.resizeOriginalOffsetLeft + (e.clientX - div.resizeMouseOriginalX)) + "px";
                div.style.top = (div.resizeOriginalOffsetTop + (div.resizeOriginalOffsetHeight - div.offsetHeight)) + "px";
            }
            else if (div.resizeOrientation == "Left") {
                div.style.width = (div.resizeOriginalOffsetWidth - (e.clientX - div.resizeMouseOriginalX)) + "px";
                div.style.left = (div.resizeOriginalOffsetLeft + (div.resizeOriginalOffsetWidth - div.offsetWidth)) + "px";
            }
            else if (div.resizeOrientation == "Right") {
                div.style.width = (div.resizeOriginalOffsetWidth + (e.clientX - div.resizeMouseOriginalX)) + "px";
            }
            else if (div.resizeOrientation == "Top") {
                div.style.height = (div.resizeOriginalOffsetHeight - (e.clientY - div.resizeMouseOriginalY)) + "px";
                div.style.top = (div.resizeOriginalOffsetTop + (div.resizeOriginalOffsetHeight - div.offsetHeight)) + "px";
            }
            else if (div.resizeOrientation == "Bottom") {
                div.style.height = (div.resizeOriginalOffsetHeight + (e.clientY - div.resizeMouseOriginalY)) + "px";
            }

            
            //document.selection.empty();

            //_txtFocusForNoSelection.focus();
            //div.focus();

        }

        function div_mousemoveForResize(ctrl)
        {

            if (_resizingDiv != null)
                return;

            var div = ctrl.elemt;

            var e = window.event;

            var newE = new Object();

            newE.offsetX = e.pageX - div.offsetLeft;
            newE.offsetY = e.pageY - div.offsetTop;

            e = newE;

            if (e.offsetX >= ((div.offsetWidth - 1) - 10) && e.offsetX <= (div.offsetWidth - 1)
                && e.offsetY >= (div.offsetHeight - 1) - 10 && e.offsetY <= (div.offsetHeight - 1)) {
                div.style.cursor = "se-resize";
                div.canResize = true;
                div.resizeOrientation = "RightBottom";
            }
            else if (e.offsetX >= 1 && e.offsetX <= 10
                && e.offsetY >= 1 && e.offsetY <= 10) {
                div.style.cursor = "nw-resize";
                div.canResize = true;
                div.resizeOrientation = "LeftTop";
            }
            else if (e.offsetX >= 1 && e.offsetX <= 10
                && e.offsetY >= (div.offsetHeight - 1) - 10 && e.offsetY <= (div.offsetHeight - 1)) {
                div.style.cursor = "sw-resize";
                div.canResize = true;
                div.resizeOrientation = "LeftBottom";
            }
            else if (e.offsetX >= ((div.offsetWidth - 1) - 10) && e.offsetX <= (div.offsetWidth - 1)
                && e.offsetY >= 1 && e.offsetY <= 10) {
                div.style.cursor = "ne-resize";
                div.canResize = true;
                div.resizeOrientation = "RightTop";
            }
            else if (e.offsetX >= 1 && e.offsetX <= 10) {
                div.style.cursor = "w-resize";
                div.canResize = true;
                div.resizeOrientation = "Left";
            }
            else if (e.offsetX >= ((div.offsetWidth - 1) - 10) && e.offsetX <= (div.offsetWidth - 1)) {
                div.style.cursor = "e-resize";
                div.canResize = true;
                div.resizeOrientation = "Right";
            }
            else if (e.offsetY >= 1 && e.offsetY <= 10) {
                div.style.cursor = "n-resize";
                div.canResize = true;
                div.resizeOrientation = "Top";
            }
            else if (e.offsetY >= (div.offsetHeight - 1) - 10 && e.offsetY <= (div.offsetHeight - 1)) {
                div.style.cursor = "s-resize";
                div.canResize = true;
                div.resizeOrientation = "Bottom";
            }
            else {
                div.style.cursor = "default";
                div.canResize = false;
                div.resizeOrientation = "";
            }

        }

        DragObj.prototype.Show = function Show()
        {
            var elemt = this.elemt;

            elemt.appendChild(this.contentElement);

            document.documentElement.appendChild(elemt);
        }

        DragObj.prototype.Close = function Close() {

            document.documentElement.removeChild(this.elemt);

        }

        DragObj.prototype.NotDrag = function NotDrag(notDragElement)
        {
            var ctrl = this;

            notDragElement.style.cursor = "auto";

            notDragElement.addEventListener("mousedown", function () {
                ctrl.isNotDrag = true;
            });
        }

        DragObj.prototype.Width = function Width(width)
        {
            if (!width)
                return this.elemt.style.width;

            this.elemt.style.width = width;
        }
        
        DragObj.prototype.Height = function Height(height)
        {
            if (!height)
                return this.elemt.style.height;

            this.elemt.style.height = height;
        }

        DragObj.prototype.Top = function Top(top)
        {
            if (!top)
                return top;

            this.top = top;

            this.elemt.style.top = top;
        }

        DragObj.prototype.Left = function Left(left)
        {
            if (!left)
                return left;

            this.left = left;

            this.elemt.style.left = left;
        }

        DragObj.prototype.Padding = function Padding(padding)
        {
            if (!padding)
                return padding;

            this.padding = padding;

            this.elemt.style.padding = padding;
        }

        DragObj.prototype.MinWidth = function MinWidth(minWidth) {

            if (!minWidth)
                return this.elemt.style.minWidth;

            this.elemt.style.minWidth = minWidth;

            
        }

        DragObj.prototype.MinHeight = function MinHeight(minHeight) {

            if (!minHeight)
                return this.elemt.style.minHeight;

            this.elemt.style.minHeight = minHeight;

            
        }
    }
)();