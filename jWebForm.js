window.addEventListener("load", jwf$Window_Load);

var jwf$Controls = new Object();

function $j(id) {
    return jwf$Controls[id];
}

function jwf$Window_Load()
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

    jwf$Controls[id] = ctrl;
}

var jwf$ControlTypes =
{
    "J:DROPDOWNLIST": jwf$DropDownList,
    "J:PICTUREBOX": jwf$PictureBox,
    "J:BUTTON": jwf$Button,
    "J:DROPMENU": jwf$DropMenu
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

function jwf$DropDownList(jelemt)
{
    if (jelemt)
    {
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
        this.height = 30;


    var elemt = document.createElement("div");

    elemt.style.width = this.width + "px";
    elemt.style.height = this.height + "px";

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
   
    drop.style.border = "solid 1px gray";
    drop.style.backgroundColor = "white";
    drop.style.position = "relative";

    elemt.appendChild(drop);

    this.drop = drop;
    drop.jwfObj = this;

    window.addEventListener("mousedown", function jwf$DropDownList$window_mousedown()
    {
        if (drop.jwfObj.mousedownSelf)
        {
            drop.jwfObj.mousedownSelf = false;
            return;
        }

        drop.style.display = "none";
    });
}

$j.DropDownList = function jwf$Create$DropDownList(id)
{
    var ctrl = new jwf$DropDownList();

    if (id)
    {
        jwf$RegiterControl(ctrl, id);
    }

    return ctrl;
}

jwf$DropDownList.prototype = new jwf$Control();

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

jwf$DropDownList.prototype.DataBind = function jwf$DropDownList$DataBind(dataSource)
{
    var drop = this.drop;
    
    for (var i = 0; i < dataSource.length; i++)
    {
        var item = document.createElement("div");
        
        item.className = "jwf_DropDownListItem";
        item.innerHTML = dataSource[i];

        item.jwfObj = this;

        item.addEventListener("mousedown",
            function jwf$DropDownList$ItemMouseDown(e)
            {
                item.jwfObj.mousedownSelf = true;
            }
        );

        item.addEventListener("click",
            function jwf$DropDownList$ItemClick(e)
            {
                var item = e.srcElement;
                var drop = item.jwfObj.drop;
                var text = item.jwfObj.text;

                text.innerHTML = item.innerHTML;

                window.setTimeout(
                    function jwf$DropDownList$ItemClickCloseDrop() {
                        drop.style.display = "none";
                    },
                    100);
            }
        );

        drop.appendChild(item);
    }
}

function jwf$PictureBox(jelemt)
{

    this.playInterval = 5000;
    this.stepInterval = 100;

    if (jelemt)
    {
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
        this.height = 300;


    var elemt = document.createElement("div");

    elemt.style.display = "inline-block";
    elemt.style.width = this.width + "px";
    elemt.style.height = this.height + "px";
    elemt.style.border = "solid 1px lightblue";


    this.elemt = elemt;
    elemt.jwfObj = this;

    var hidden = document.createElement("div");
    hidden.style.display = "none";

    this.hidden = hidden;

    elemt.appendChild(hidden);

    var imgDiv = document.createElement("div");

    imgDiv.style.width = "100%";
    imgDiv.style.height = "100%";
    imgDiv.style.overflow = "hidden";

    this.imgDiv = imgDiv;

    elemt.appendChild(imgDiv);

}

$j.PictureBox = function jwf$Create$PictureBox(id)
{
    var ctrl = new jwf$PictureBox();

    if (id) {
        jwf$RegiterControl(ctrl, id);
    }

    return ctrl;
}

jwf$PictureBox.prototype = new jwf$Control();

jwf$PictureBox.prototype.Width = function jwf$PictureBox$Width(width)
{
    if (!width)
        return this.width;

    throw "jWebForm Error: 暂不支持 设置 Width 。"
    //this.width = parseInt(width.replace("px", ""));

    //this.elemt.style.width = this.width + "px";
}

jwf$PictureBox.prototype.Height = function jwf$PictureBox$Height(height)
{
    if (!height)
        return this.height;

    throw "jWebForm Error: 暂不支持 设置 Height 。"
    //this.height = parseInt(height.replace("px", ""));

    //this.elemt.style.height = this.height + "px";
}

jwf$PictureBox.prototype.LoadImages = function jwf$PictureBox$LoadImages(urlList, callback)
{
    
    this.imgList = [];

    this.imgLoadCount = 0;

    this.imgCount = urlList.length;


    for (var i=0; i<urlList.length; i++)
    {
        var url = urlList[i];
        var img = document.createElement("img");

        img.style.width = this.width + "px";
        img.style.height = this.height + "px";
        
        img.src = url;

        img.addEventListener("load", function jwf$PictureBox$PlayImageOnLoad(e)
        {
            var img = e.srcElement;
            var picBox = img.jwfObj;

            picBox.imgLoadCount++;

            if (picBox.imgLoadCount == picBox.imgCount)
            {
                picBox.imgDiv.appendChild(picBox.imgList[0]);

                callback(picBox);
            }
        });

        img.jwfObj = this;

        if (i > 0)
        {
            img.style.display = "none";
        }

        this.imgList[this.imgList.length] = img;
        this.hidden.appendChild(img);
    }
}

jwf$PictureBox.prototype.Play = function jwf$PictureBox$Play()
{
    this.imgIndex = 1;

    window.setTimeout(jwf$PictureBox$PlayOneImage, this.playInterval, this);   
}

function jwf$PictureBox$PlayOneImage(picBox)
{
    var imgDiv = picBox.imgDiv;

    var img = picBox.imgList[picBox.imgIndex];

    img.style.marginTop = (picBox.height * -1) + "px";

    var imgOld = picBox.imgDiv.childNodes[0];

    imgDiv.insertBefore(img, imgOld);
    
    img.style.display = "";

    picBox.stepCount = 0;

    picBox.playOneImageStepHandle = window.setInterval(jwf$PictureBox$PlayOneImageStep, picBox.stepInterval, picBox);
}

function jwf$PictureBox$PlayOneImageStep(picBox)
{
    var imgDiv = picBox.imgDiv;

    var top = picBox.height * (1 - picBox.stepCount / 10);

    if (top < 0)
        top = 0;

    var img = imgDiv.childNodes[0];
    var imgOld = imgDiv.childNodes[1];

    img.style.marginTop = (top * -1) + "px";

    if (top == 0)
    {
        window.clearInterval(picBox.playOneImageStepHandle);

        imgDiv.removeChild(imgOld);
        imgOld.style.display = "none";

        picBox.stepCount = 0;

        picBox.imgIndex++;
        
        if (picBox.imgIndex == picBox.imgCount)
        {
            picBox.imgIndex = 0;
        }

        window.setTimeout(jwf$PictureBox$PlayOneImage, picBox.playInterval, picBox);

        return;
    }

    picBox.stepCount++;

}

function jwf$Button(jelemt)
{
    if (jelemt)
    {
        var width = jelemt.getAttribute("Width");
        var height = jelemt.getAttribute("Height");
        var text = jelemt.getAttribute("Text");
        var click = jelemt.getAttribute("OnClick");
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

    elemt.addEventListener("click", function jwf$Button$Click() {
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

$j.Button = function jwf$Create$Button(id)
{
    var ctrl = new jwf$Button();

    if (id)
    {
        jwf$RegiterControl(ctrl, id);
    }

    return ctrl;
}

jwf$Button.prototype = new jwf$Control();

jwf$Button.prototype.Width = function jwf$Button$Width(width)
{
    if (!width)
        return this.width;

    this.width = parseInt(width.replace("px", ""));

    this.elemt.style.width = this.width + "px";
}

jwf$Button.prototype.Height = function jwf$Button$Height(height)
{
    if (!height)
        return this.height;

    this.height = parseInt(height.replace("px", ""));

    this.elemt.style.height = this.height + "px";
}

jwf$Button.prototype.Click = function jwf$Button$Click(click)
{
    if (!click)
        return this.click;

    this.click = click;
}

jwf$Button.prototype.Text = function jwf$Button$Text(text)
{
    if (!text)
        return this.text;

    this.text = text;
    this.textDiv.innerHTML = text;
}

function jwf$DropMenu(jelemt)
{
    var elemt = document.createElement("div");

    elemt.style.display = "inline-block";

    elemt.style.cursor = "default";

    this.elemt = elemt;
    elemt.jwfObj = this;
}

$j.DropMenu = function jwf$Create$DropMenu(id)
{
    var ctrl = new jwf$DropMenu();

    if (id)
    {
        jwf$RegiterControl(ctrl, id);
    }

    return ctrl;
}

jwf$DropMenu.prototype = new jwf$Control();

jwf$DropMenu.prototype.AddTopItem = function jwf$DropMenu$AddTopItem(topItem)
{
    if (!topItem instanceof jwf$DropMenu$TopItem)
        throw "参数 topItem 不是 TopItem 对象，应使用 $j.DropMenu.TopItem() 方法创建 TopItem 。";

    var elemt = this.elemt;

    elemt.appendChild(topItem.div);
}

function jwf$DropMenu$TopItem(text)
{
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

    textDiv.addEventListener("mousedown", function jwf$DropMenu$TopItem$textDiv_mousedown()
    {
        drop.style.display = "block";
    });

    div.addEventListener("mousedown", function jwf$DropMenu$TopItem$div_mousedown()
    {
        div.jwfObj.mousedownSelf = true;
    });

    window.addEventListener("mousedown", function jwf$DropMenu$window_mousedown()
    {
        if (drop.jwfObj.mousedownSelf) {
            drop.jwfObj.mousedownSelf = false;
            return;
        }

        drop.style.display = "none";
    });
}

$j.DropMenu.TopItem = function jwf$Create$DropMenu$TopItem(text)
{
    return new jwf$DropMenu$TopItem(text);
}

jwf$DropMenu$TopItem.prototype.AddSubItem = function jwf$DropMenu$TopItem$AddSubItem(subItem)
{
    if (!subItem instanceof jwf$DropMenu$SubItem)
        throw "参数 subItem 不是 SubItem 对象，应使用 $j.DropMenu.SubItem() 方法创建 SubItem 。";

    var drop = this.drop;

    subItem.drop = drop;

    drop.appendChild(subItem.div);
}

function jwf$DropMenu$SubItem(text, click)
{
    var div = document.createElement("div");

    div.style.paddingLeft = "5px";
    div.style.paddingRight = "5px";
    div.className = "jwf_DropMenu_SubItem";

    div.innerText = text;

    this.div = div;
    div.jwfObj = this;

    var subItem = this;

    div.addEventListener("click", function jwf$DropMenu$SubItem$div_click()
    {
        var drop = subItem.drop;

        if (drop)
            drop.style.display = "none";

        if (click)
            click(subItem);
    });
}

$j.DropMenu.SubItem = function jwf$Create$DropMenu$SubItem(text, click)
{
    return new jwf$DropMenu$SubItem(text, click);
}
