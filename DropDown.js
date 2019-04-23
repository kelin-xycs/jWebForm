(
    function()
    {

        $j.RegisterControlType("J:DROPDOWN", DropDown);

        function DropDown(jelemt)
        {
            if (jelemt) {
                var width = jelemt.getAttribute("Width");
                var height = jelemt.getAttribute("Height");
            }

            if (width)
                this.width = parseInt(width.replace("px", ""));
            else
                this.width = 200;

            if (height)
                this.height = parseInt(height.replace("px", ""));
            else
                this.height = 100;


            var elemt = document.createElement("div");

            elemt.style.display = "inline-block";

            this.elemt = elemt;
            

            var top = document.createElement("div");

            elemt.appendChild(top);

            this.top = top;


            var drop = document.createElement("div");

            drop.style.display = "none";
            drop.style.position = "absolute";
            drop.style.zIndex = 1;

            elemt.appendChild(drop);

            this.drop = drop;


            var ctrl = this;

            top.addEventListener("mousedown",
                function top_mousedown(e)
                {
                    drop.style.display = "block";
                    ctrl.isMouseDownSelf = true;
                }
            );

            drop.addEventListener("mousedown",
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

                drop.style.display = "none";
            });
            //jwf$AddEventHandler_To_Frames_Window_MouseDown(function jwf$DropDownList$window_mousedown()
            //{
            //    if (ctrl.isMouseDownSelf)
            //    {
            //        ctrl.isMouseDownSelf = false;
            //        return;
            //    }

            //    drop.style.display = "none";
            //});
        }

        window.$j.DropDown = CreateDropDown;

        function CreateDropDown(id)
        {
            var ctrl = new DropDown();

            if (id) {
                $j.RegisterControl(ctrl, id);
            }

            return ctrl;
        }

        DropDown.prototype = $j.Control();

        DropDown.prototype.Top = function Top(topElement) {
            var top = this.top;

            if (!topElement)
                return top.firstChild;

            if (top.firstChild)
                top.removeChild(top.firstChild);

            top.appendChild(topElement);
        }

        DropDown.prototype.Drop = function Drop(dropElement) {
            var drop = this.drop;

            if (!dropElement)
                return drop.firstChild;

            if (drop.firstChild)
                drop.removeChild(drop.firstChild);

            drop.appendChild(dropElement);
        }

        DropDown.prototype.Close = function Close() {
            var drop = this.drop;

            drop.style.display = "none";
        }
        
    }
)();