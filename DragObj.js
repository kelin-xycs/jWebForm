(
    function ()
    {
        window.$j.DragObj = function CreateDragObj(contentElement, width, height)
        {
            return new DragObj(contentElement, width, height);
        }

        function DragObj(contentElement)
        {

            this.left = "200px";
            this.top = "100px";
            this.width = "200px";
            this.height = "150px";
            this.padding = "2px";


            var elemt = document.createElement("div");

            elemt.style.position = "absolute";
            elemt.style.top = this.top;
            elemt.style.left = this.left;
            elemt.style.width = this.width;
            elemt.style.height = this.height;
            elemt.style.padding = "5px";
            elemt.style.zIndex = _defaultZIndex;


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

            this.contentElement = contentElement;

        }


        var _isInit = false;
        var _txtFocusForNoSelection = null;
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

        }

        function window_mouseup() {

            window.removeEventListener("mouseup", window_mouseup);
            window.removeEventListener("mousemove", window_mousemove);

        }

        function window_mousemove() {
            
            var e = window.event;
            var div = _draggingDiv;

            div.style.position = "absolute";
            div.style.top = (e.clientY - _offY) + "px";
            div.style.left = (e.clientX - _offX) + "px";

            _txtFocusForNoSelection.focus();
            div.focus();
        }

        function window_mouseupForResize()
        {
            var div = _resizingDiv;

            div.canResize = false;
            div.resizeOrientation = "";

            _resizingDiv = null;

            window.removeEventListener("mousemove", window_mousemoveForResize);
            window.removeEventListener("mouseup", window_mouseupForResize);
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
                div.style.left = (div.resizeOriginalOffsetLeft + (e.clientX - div.resizeMouseOriginalX)) + "px";
                div.style.top = (div.resizeOriginalOffsetTop + (e.clientY - div.resizeMouseOriginalY)) + "px";
            }
            else if (div.resizeOrientation == "LeftBottom") {
                div.style.width = (div.resizeOriginalOffsetWidth - (e.clientX - div.resizeMouseOriginalX)) + "px";
                div.style.height = (div.resizeOriginalOffsetHeight + (e.clientY - div.resizeMouseOriginalY)) + "px";
                div.style.left = (div.resizeOriginalOffsetLeft + (e.clientX - div.resizeMouseOriginalX)) + "px";
                //div.style.top = (div.resizeOriginalOffsetTop + (e.clientY - div.resizeMouseOriginalY)) + "px";
            }
            else if (div.resizeOrientation == "RightTop") {
                div.style.width = (div.resizeOriginalOffsetWidth + (e.clientX - div.resizeMouseOriginalX)) + "px";
                div.style.height = (div.resizeOriginalOffsetHeight - (e.clientY - div.resizeMouseOriginalY)) + "px";
                //div.style.left = (div.resizeOriginalOffsetLeft + (e.clientX - div.resizeMouseOriginalX)) + "px";
                div.style.top = (div.resizeOriginalOffsetTop + (e.clientY - div.resizeMouseOriginalY)) + "px";
            }
            else if (div.resizeOrientation == "Left") {
                div.style.width = (div.resizeOriginalOffsetWidth - (e.clientX - div.resizeMouseOriginalX)) + "px";
                div.style.left = (div.resizeOriginalOffsetLeft + (e.clientX - div.resizeMouseOriginalX)) + "px";
            }
            else if (div.resizeOrientation == "Right") {
                div.style.width = (div.resizeOriginalOffsetWidth + (e.clientX - div.resizeMouseOriginalX)) + "px";
            }
            else if (div.resizeOrientation == "Top") {
                div.style.height = (div.resizeOriginalOffsetHeight - (e.clientY - div.resizeMouseOriginalY)) + "px";
                div.style.top = (div.resizeOriginalOffsetTop + (e.clientY - div.resizeMouseOriginalY)) + "px";
            }
            else if (div.resizeOrientation == "Bottom") {
                div.style.height = (div.resizeOriginalOffsetHeight + (e.clientY - div.resizeMouseOriginalY)) + "px";
            }

            _txtFocusForNoSelection.focus();
            div.focus();

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
            if (_isInit == false)
            {
                var txtFocus = document.createElement("input");
                txtFocus.type = "text";
                txtFocus.style.width = "0px";
                txtFocus.style.height = "0px";
                txtFocus.style.position = "absolute";
                txtFocus.style.top = "-10px";
                txtFocus.style.left = "-10px";

                document.documentElement.appendChild(txtFocus);

                _txtFocusForNoSelection = txtFocus;

                _isInit = true;
            }


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
                return this.width;

            this.width = width;

            this.elemt.style.width = width;
        }
        
        DragObj.prototype.Height = function Height(height)
        {
            if (!height)
                return this.height;

            this.height = height;

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
    }
)();