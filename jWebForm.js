window.addEventListener("load", jwf$Window_Load);
window.addEventListener("mousedown", jwf$Window_MouseDown);

var jwf$Controls = new Object();
var jwf$Window_MouseDown_Events = [];

function $j(id) {
    return jwf$Controls[id];
}

function jwf$Window_Load() {

    jwf$InitControls();

    if ($j.Page_Load) {
        $j.Page_Load();
    }
}

function jwf$AddEventHandler_Window_MouseDown(handler) {
    jwf$Window_MouseDown_Events[jwf$Window_MouseDown_Events.length] = handler;
}
function jwf$Window_MouseDown() {
    for (i = 0; i < jwf$Window_MouseDown_Events.length; i++) {
        jwf$Window_MouseDown_Events[i]();
    }
}

function jwf$InitControls() {
    var jelemts = [];

    jwf$GetJwfElements(jelemts, document.body);

    for (i = 0; i < jelemts.length; i++) {
        var jelemt = jelemts[i];

        var ctrl = jwf$GetControl(jelemt);

        jelemt.parentNode.insertBefore(ctrl.elemt, jelemt);

        jwf$Controls[jelemt.getAttribute("id")] = ctrl;
    }
}

function jwf$GetControl(jelemt) {
    if (jelemt.nodeName == "J:DROPDOWNLIST") {
        return new jwf$DropDownList(jelemt);
    }

    throw "无效的 nodeName ：\"" + jelemt.nodeName + "\" 。";
}

function jwf$DropDownList( jelemt ) {


    var width = jelemt.getAttribute("Width");
    var height = jelemt.getAttribute("Height");

    if (width)
        this.width = parseInt(width.replace("px", ""));
    else
        this.width = 200;

    if (height)
        this.height = parseInt(height.replace("px", ""));
    else
        this.height = 30;


    var elemt = document.createElement("div");

    elemt.style.display = "inner-block";
    elemt.style.width = this.width + "px";
    elemt.style.height = this.height + "px";
    //elemt.style.backgroundColor = "red";

    this.elemt = elemt;
    elemt.jwfObj = this;


    var text = document.createElement("div");
    text.style.width = (this.width - 2) + "px";
    text.style.height = (this.height - 2) + "px";
    text.style.border = "solid 1px lightblue";

    text.addEventListener("click",
        function jwf$DropDownList$elemt$click(e) {
            var elemt = e.srcElement;
            elemt.jwfObj.drop.style.display = "block";
        }
    );


    text.addEventListener("mousedown",
        function jwf$DropDownList$MouseDown(e) {
            elemt.jwfObj.mousedownSelf = true;
        }
    );

    elemt.appendChild(text);

    this.text = text;
    text.jwfObj = this;




    var drop = document.createElement("div");

    drop.style.display = "none";
    drop.style.width = text.style.width;
    //drop.style.height = "300px";
    drop.style.border = "solid 1px gray";
    drop.style.position = "relative";
    //drop.style.top = elemt.style.height;

    elemt.appendChild(drop);


    this.drop = drop;
    drop.jwfObj = this;


    jwf$AddEventHandler_Window_MouseDown(
        function jwf$DropDownList$Window_MouseDown() {
            if (drop.jwfObj.mousedownSelf) {
                drop.jwfObj.mousedownSelf = false;
                return;
            }

            drop.style.display = "none";
        }
    );
}

$j.DropDownList = jwf$DropDownList;

//jwf$DropDownList.prototype.OnFocus = null;

jwf$DropDownList.prototype.Width = function jwf$DropDownList$Width(width)
{
    if (!width)
        return this.width;

    this.width = parseInt(width.replace("px", ""));

    this.elemt.style.width = this.width + "px";
    this.text.style.width = (this.width - 2) + "px";
    this.drop.style.width = this.text.style.width;
}

jwf$DropDownList.prototype.Height = function jwf$DropDownList$Height(height)
{
    if (!height)
        return this.height;

    this.height = parseInt(height.replace("px", ""));

    this.elemt.style.height = this.height + "px";
    this.text.style.height = (this.height - 2) + "px";
}

jwf$DropDownList.prototype.DataBind = function jwf$DropDownList$DataBind(dataSource) {
    var drop = this.drop;
    //var text = this.text;

    for (i = 0; i < dataSource.length; i++) {
        var item = document.createElement("div");
        item.style.display = "inner-block";
        item.className = "jwf_DropDownListItem";
        item.innerHTML = dataSource[i];

        item.jwfObj = this;

        item.addEventListener("mousedown",
            function jwf$DropDownList$ItemMouseDown(e) {
                item.jwfObj.mousedownSelf = true;
            }
        );

        item.addEventListener("click",
            function jwf$DropDownList$ItemClick(e) {
                var item = e.srcElement;
                var drop = item.jwfObj.drop;
                var text = item.jwfObj.text;

                text.innerHTML = item.innerHTML;

                window.setTimeout(
                    function jwf$DropDownList$ItemClickCloseDrop() {
                        drop.style.display = "none";
                    },
                    100);
                //drop.style.display = "none";
            }
        );

        drop.appendChild(item);
    }
}

// 因为 document  document.documentElement  document.body 的 getElementsByTagNameNS() 方法不起作用，
// 返回 空集合，所以只能递归遍历来查找 jWebForm（j:） 元素。
function jwf$GetJwfElements(elemts, elemt) {
    var s = elemt.nodeName.substring(0, 2);
    if (elemt.nodeName.substring(0, 2) == "J:") {
        elemts[elemts.length] = elemt;
    }

    if (elemt.childNodes.length == 0)
        return;

    for (i = 0; i < elemt.childNodes.length; i++) {
        var childNode = elemt.childNodes[i];

        jwf$GetJwfElements(elemts, childNode);
    }

}