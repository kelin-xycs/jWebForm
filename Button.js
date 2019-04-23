(
    function ()
    {
        $j.RegisterControlType("J:BUTTON", Button);

        function Button(jelemt)
        {
            if (jelemt) {
                var width = jelemt.getAttribute("Width");
                var height = jelemt.getAttribute("Height");
                var text = jelemt.getAttribute("Text");
                var click = jelemt.getAttribute("Click");
            }

            if (width)
                this.width = parseInt(width.replace("px", ""));
            else
                this.width = 200;

            if (height)
                this.height = parseInt(height.replace("px", ""));
            else
                this.height = 30;

            if (text)
                this.text = text;
            else
                this.text = "";

            if (click)
                this.click = click;


            var elemt = document.createElement("div");

            elemt.style.boxSizing = "border-box";

            elemt.style.width = this.width + "px";
            elemt.style.height = this.height + "px";

            elemt.className = "jwf_Button";

            elemt.style.display = "inline-flex";
            elemt.style.justifyContent = "center";
            elemt.style.alignItems = "center";

            elemt.addEventListener("click", function Click()
            {
                var btn = elemt.jwfObj;

                var handler;

                if (typeof (btn.click) == "string") {
                    handler = window[btn.click];
                }
                else if (typeof (btn.click) == "function") {
                    handler = btn.click;
                }

                if (!handler) {
                    throw "jWebForm Error: \"" + btn.click + "\" 不是有效的 函数名 或 函数 。"
                }

                handler(btn);

            });

            this.elemt = elemt;
            elemt.jwfObj = this;

            var textDiv = document.createElement("div");

            this.textDiv = textDiv;

            textDiv.style.width = "fit-content";

            textDiv.innerHTML = this.text;

            elemt.appendChild(textDiv);

        }

        $j.Button = function CreateButton(id)
        {
            var ctrl = new Button();

            if (id) {
                jwf$RegiterControl(ctrl, id);
            }

            return ctrl;
        }

        Button.prototype = $j.Control();

        Button.prototype.Width = function Width(width)
        {
            if (!width)
                return this.width;

            this.width = parseInt(width.replace("px", ""));

            this.elemt.style.width = this.width + "px";
        }

        Button.prototype.Height = function Height(height)
        {
            if (!height)
                return this.height;

            this.height = parseInt(height.replace("px", ""));

            this.elemt.style.height = this.height + "px";
        }

        Button.prototype.Click = function Click(click)
        {
            if (!click)
                return this.click;

            this.click = click;
        }

        Button.prototype.Text = function Text(text)
        {
            if (!text)
                return this.text;

            this.text = text;
            this.textDiv.innerHTML = text;
        }
    }
)();