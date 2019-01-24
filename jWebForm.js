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

    for (i = 0; i < jelemts.length; i++)
    {
        var jelemt = jelemts[i];

        var ctrl = jwf$GetControl(jelemt);

        var id = jelemt.getAttribute("id");

        if (id)
        {
            ctrl.id = id;
            ctrl.elemt.id = id;

            jwf$Controls[id] = ctrl;
        }

        jelemt.parentNode.replaceChild(ctrl.elemt, jelemt);

    }
}

function jwf$GetControl(jelemt)
{
    if (jelemt.nodeName == "J:DROPDOWNLIST")
    {
        return new jwf$DropDownList(jelemt);
    }
    else if (jelemt.nodeName == "J:PICTUREBOX")
    {
        return new jwf$PictureBox(jelemt);
    }
    else if (jelemt.nodeName == "J:BUTTON")
    {
        return new jwf$Button(jelemt);
    }

    throw "无效的 nodeName ：\"" + jelemt.nodeName + "\" 。";
}

function jwf$DropDownList(jelemt)
{
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

    elemt.style.display = "inline-block";
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
    
    for (i = 0; i < dataSource.length; i++)
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

function jwf$PictureBox(jelemt)
{

    this.playInterval = 5000;
    this.stepInterval = 100;

    var width = jelemt.getAttribute("Width");
    var height = jelemt.getAttribute("Height");

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

$j.PictureBox = jwf$PictureBox;

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


    for (i=0; i<urlList.length; i++)
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
    var width = jelemt.getAttribute("Width");
    var height = jelemt.getAttribute("Height");
    var text = jelemt.getAttribute("Text");
    var click = jelemt.getAttribute("OnClick");

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

$j.Button = jwf$Button;

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