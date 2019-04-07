(
    function()
    {
        jwf$ControlTypes["J:DROPDOWNLIST"] = DropDownList;

        function DropDownList(jelemt) {
            if (jelemt) {
                var width = jelemt.getAttribute("Width");
                var height = jelemt.getAttribute("Height");
                var selectChanged = jelemt.getAttribute("SelectChanged");
            }

            if (width)
                this.width = width;
            else
                this.width = "200px";

            if (height)
                this.height = height;
            else
                this.height = "22px";

            if (selectChanged)
                this.selectChanged = selectChanged;


            var dropDown = $j.DropDown();
            this.dropDown = dropDown;

            this.elemt = dropDown.elemt;


            var text = document.createElement("div");

            text.style.width = this.width;
            text.style.height = this.height;
            text.style.border = "solid 1px lightblue";
            text.innerHTML = "&nbsp;";    //  预先给 text div 赋值一个文本，这样 DropDownList 和其它文本放在一起时，对齐方式可以统一。没有文本的 inline-block 的 div 会比旁边的文本高一点，第一次选择 item 给 text div 赋值文本时会和旁边的文本对齐，此时 text div 会产生一个向下的小移动

            dropDown.Top(text);

            this.text = text;


            var list = document.createElement("div");
            list.style.width = this.width;
            list.style.border = "solid 1px gray";
            list.style.backgroundColor = "white";

            dropDown.Drop(list);

            this.list = list;


            this.selectedItem = null;

        }

        $j.DropDownList = function CreateDropDownList(id) {
            var ctrl = new DropDownList();

            if (id) {
                jwf$RegiterControl(ctrl, id);
            }

            return ctrl;
        }

        DropDownList.prototype = new jwf$Control();

        DropDownList.prototype.Width = function Width(width) {
            if (!width)
                return this.width;

            this.width = width;

            this.text.style.width = width;
        }

        DropDownList.prototype.Height = function Height(height) {
            if (!height)
                return this.height;

            this.height = height;

            this.text.style.height = height;
        }

        DropDownList.prototype.DataBind = function DataBind(dataSource)
        {
            var ctrl = this;
            var text = this.text;
            var list = this.list;

            for (var i = 0; i < dataSource.length; i++) {
                let item = document.createElement("div");

                item.className = "jwf_DropDownListItem";
                item.innerHTML = dataSource[i];

                item.addEventListener("mousedown",
                    function jwf$DropDownList$ItemMouseDown(e) {
                        ctrl.mousedownSelf = true;
                    }
                );

                item.addEventListener("click",
                    function jwf$DropDownList$ItemClick() {

                        text.innerHTML = item.innerHTML;
                        
                        //  这个 延时 其实也可以不用加，加延时的话体验效果会好一点，不加的话下拉框消失的太快了，当然这个看法因人而异 :)
                        window.setTimeout(
                            function jwf$DropDownList$ItemClickCloseDrop() {
                                ctrl.dropDown.Close();
                            },
                            100);

                        if (item != ctrl.selectedItem)
                        {
                            ctrl.selectedItem = item;

                            RaiseSelectChangedEvent( ctrl );
                        }
                    }
                );

                list.appendChild(item);
            }
        }

        function RaiseSelectChangedEvent( ctrl )
        {
            var handler;

            if (typeof (ctrl.selectChanged) == "string") {
                handler = window[ctrl.selectChanged];
            }
            else if (typeof (ctrl.selectChanged) == "function") {
                handler = ctrl.selectChanged;
            }

            if (handler)
                handler(ctrl);
        }

        DropDownList.prototype.SelectChanged = function SelectChanged(selectChanged) {
            if (!selectChanged)
                return this.selectChanged;

            this.selectChanged = selectChanged;
        }

        DropDownList.prototype.SelectedText = function SelectedText()
        {
            if (!this.selectedItem)
                return "";

            return this.selectedItem.innerText;
        }
    }
)();