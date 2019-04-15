document.documentElement.setAttribute("ondragstart", "return false;");

window.addEventListener("load", jwf$window_load);
window.addEventListener("mousedown", jwf$window_mousedown);

/* 这部分是 为了解决 window mousedown 事件 在 iframe 里 不起作用 的 问题
   iframe 是一个 独立的 window ， 点击 iframe 内容只会触发 iframe 窗口自己的 mousedown 事件
   这样就导致 主窗口 的 DropDown DropDownList DropMenu 等 控件 不能利用 window mousedown 事件 关闭 下拉框 下拉菜单
   使用方法 是：

    1 jWebForm 控件 使用 jwf$AddEventHandler_To_Frames_Window_MouseDown(handler) 方法 来 添加 window mousedown 事件 
      代替 window.addEventListener("mousedown", function xxx());

    2 开发人员 应负责 把 $j.Frame_Window_MouseDown 添加到 iframe 的 window mousedown 事件，如下：

      var ifr = document.getElementById("ifr");
      ifr.contentWindow.addEventListener("mousedown", $j.Frame_Window_MouseDown);

    当然，第 2 步 不是必须的，如果不做 第 2 步，那么，jWebForm 就不知道 点击 iframe 的事件发生，
    导致的效果就是 比如 点击 iframe 时 主窗口 里的 DropDown DropDownList DropMenu 的 下拉框 下拉菜单 不会关闭
    当然这不一定是问题，有时候这样的效果也是可以接受的，甚至有时候要的就是这种效果。 ^^

   推而广之，如果一个页面中包含多个 iframe， iframe 也有嵌套，那么也适用上述的做法，
   我们把 主窗口 和 iframe 都看作是一个 frame，
   假设一个 页面 中有 n 个 frame，
   开发人员 在 A frame 中使用了 jWebForm 控件，
   则可以选择将 A frame 的 $j.Frame_Window_MouseDown 添加到 其它的任意的 frame 的 window mousedown 事件。
   在 B frame ， C frame …… 中 使用了 jWebForm 控件亦然，依此类推。
   可以同时在多个 frame 中同时使用 jWebForm 控件。
*/
var jwf$window_mousedown$handlers = [];

function jwf$window_mousedown()
{
    for (var i = 0; i < jwf$window_mousedown$handlers.length; i++)
    {
        var handler = jwf$window_mousedown$handlers[i];

        handler();
    }
}

function jwf$AddEventHandler_To_Frames_Window_MouseDown(handler)
{
    jwf$window_mousedown$handlers[jwf$window_mousedown$handlers.length] = handler;
}

$j.Frame_Window_MouseDown = jwf$window_mousedown;
/*  *****************************************  */

var jwf$controls = new Object();

function $j(id)
{
    return jwf$controls[id];
}

function jwf$window_load()
{
    jwf$InitControls();

    if ($j.Page_Load)
    {
        $j.Page_Load();
    }
}

function jwf$InitControls() {
    var jelemts = [];

    jwf$GetJwfElements(jelemts, document.body);

    for (var i = 0; i < jelemts.length; i++)
    {
        var jelemt = jelemts[i];

        var ctrl = jwf$GetControl(jelemt);

        var id = jelemt.getAttribute("id");

        if (id)
        {
            jwf$RegiterControl(ctrl, id);
        }

        jelemt.parentNode.replaceChild(ctrl.elemt, jelemt);

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

    for (var i = 0; i < elemt.childNodes.length; i++) {
        var childNode = elemt.childNodes[i];

        jwf$GetJwfElements(elemts, childNode);
    }
}

function jwf$RegiterControl(ctrl, id)
{
    ctrl.id = id;
    ctrl.elemt.id = id;

    jwf$controls[id] = ctrl;
}

var jwf$ControlTypes =
{
    //"J:DROPDOWNLIST": jwf$DropDownList,
    //"J:PICTUREBOX": jwf$PictureBox,
    //"J:BUTTON": jwf$Button,
    //"J:DROPMENU": jwf$DropMenu
};

function jwf$GetControl(jelemt)
{
    var ctor = jwf$ControlTypes[jelemt.nodeName];

    if (!ctor)
        throw "无效的 nodeName ：\"" + jelemt.nodeName + "\" 。";

    return new ctor(jelemt);

    //if (jelemt.nodeName == "J:DROPDOWNLIST")
    //{
    //    return new jwf$DropDownList(jelemt);
    //}
    //else if (jelemt.nodeName == "J:PICTUREBOX")
    //{
    //    return new jwf$PictureBox(jelemt);
    //}
    //else if (jelemt.nodeName == "J:BUTTON")
    //{
    //    return new jwf$Button(jelemt);
    //}
    //else if (jelemt.nodeName == "J:DROPMENU")
    //{
    //    return new jwf$DropMenu(jelemt);
    //}

    //throw "无效的 nodeName ：\"" + jelemt.nodeName + "\" 。";
}

function jwf$Control()
{
    
}

jwf$Control.prototype.Element = function jwf$Control$Element()
{
    return this.elemt;
}


