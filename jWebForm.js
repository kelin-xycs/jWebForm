(
    function ()
    {
        document.documentElement.setAttribute("ondragstart", "return false;");

        window.addEventListener("load", window_load);
        //window.addEventListener("mousedown", window_mousedown);

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
        

        //function AddEventHandler_To_Frames_Window_MouseDown(handler) {
        //    window_mousedown$handlers[window_mousedown$handlers.length] = handler;
        //}

        
        /*  *****************************************  */

        var controls = new Object();

        function $j(id) {
            return controls[id];
        }

        function window_load() {
            InitControls();

            if ($j.Page_Load) {
                $j.Page_Load();
            }
        }

        function InitControls() {
            var jelemts = [];

            GetJwfElements(jelemts, document.body);

            for (var i = 0; i < jelemts.length; i++) {
                var jelemt = jelemts[i];

                var ctrl = GetControl(jelemt);

                var id = jelemt.getAttribute("id");

                if (id) {
                    RegisterControl(ctrl, id);
                }

                jelemt.parentNode.replaceChild(ctrl.elemt, jelemt);

            }
        }

        // 因为 document  document.documentElement  document.body 的 getElementsByTagNameNS() 方法不起作用，
        // 返回 空集合，所以只能递归遍历来查找 jWebForm（j:） 元素。
        function GetJwfElements(elemts, elemt) {
            var s = elemt.nodeName.substring(0, 2);
            if (elemt.nodeName.substring(0, 2) == "J:") {
                elemts[elemts.length] = elemt;
            }

            if (elemt.childNodes.length == 0)
                return;

            for (var i = 0; i < elemt.childNodes.length; i++) {
                var childNode = elemt.childNodes[i];

                GetJwfElements(elemts, childNode);
            }
        }

        $j.RegisterControl = RegisterControl;

        function RegisterControl(ctrl, id) {
            ctrl.id = id;
            ctrl.elemt.id = id;

            controls[id] = ctrl;
        }

        var controlTypes = new Object();

        function RegisterControlType(nodeName, type)
        {
            controlTypes[nodeName] = type;
        }

        
        function GetControl(jelemt) {
            var ctor = controlTypes[jelemt.nodeName];

            if (!ctor)
                throw "未注册的 nodeName ：\"" + jelemt.nodeName + "\"，请使用 RegisterControlType(nodeName, type) 注册 。";

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

        function Control() {

        }

        Control.prototype.Element = function Element() {
            return this.elemt;
        }

        
            
        //$j.Frame_Window_MouseDown = window_mousedown;
        $j.RegisterControlType = RegisterControlType;
        $j.Control = function CreateControl()
        {
            return new Control();
        }

        $j.getElementById = function getElementById(containerElement, id)
        {
            
            var child = containerElement.firstElementChild;

            if (!child)
                return null;

            while (true)
            {
                if (child.id == id)
                    return child;

                

                var temp = getElementById(child, id);

                if (temp)
                    return temp;
                
                if (!child.nextElementSibling)
                    break;

                child = child.nextElementSibling;
            }

            return null;
        }

        //var window_mousedown$handlers = [];

        //  为了实现 跨 frame 的 全局事件，所以使用 $j.addEventListener(type, listener) 方法
        //  为了让 全局事件 生效，需要调用 $j.RegisterFrame(win) 方法将 frame window 注册到 $j
        //  引用了 jWebForm.js 的页面会自动调用 $j.RegisterFrame(win) 将当前 window 注册到 $j
        //  未引用 jWebForm.js 的 frame 页面需要手动调用 $j.RegisterFrame(win) 将 frame window 注册到 $j
        //  $j.RegisterFrame(win) 方法可以在任何 frame 中调用，该方法会找到 顶层窗口（top window），将 注册信息 保存在 top window
        $j.addEventListener = function addEventListener(type, listener) {

            var handlers = top.jwf$frameEvents[type];

            if (!handlers)
                throw "尚未支持 \"" + type + "\" 事件 。";

            handlers.Add(listener);
        }
            

        $j.removeEventListener = function removeEventListener(type, listener)
        {
            var handlers = top.jwf$frameEvents[type];

            handlers.MoveToStart();

            while (handlers.MoveNext())
            {
                var node = handlers.Current();
                var h = node.value;

                if (h == listener)
                {
                    handlers.Remove(node);
                    break;
                }
            }
        }
        //function window_mousedown() {
        //    for (var i = 0; i < window_mousedown$handlers.length; i++) {
        //        var handler = window_mousedown$handlers[i];

        //        handler();
        //    }
        //}

        function RaiseEvent(handlers, e)
        {
            handlers.MoveToStart();

            while (handlers.MoveNext())
            {
                var handler = handlers.Current().value;

                handler(e);
            }
        }

        function GetTopWindow(win) {
            if (win.parent == win)
                return win;

            return GetTopWindow(win.parent);
        }


        function RegisterFrame(win)
        {
            win.addEventListener("mousedown", frame_mousedown);
            win.addEventListener("mousemove", frame_mousemove);
            win.addEventListener("mouseup", frame_mouseup);
        }

        function frame_mousedown(e)
        {
            var handlers = top.jwf$frameEvents["mousedown"];

            RaiseEvent(handlers, e);
        }

        function frame_mousemove(e) {
            var handlers = top.jwf$frameEvents["mousemove"];

            RaiseEvent(handlers, e);
        }

        function frame_mouseup(e) {
            var handlers = top.jwf$frameEvents["mouseup"];

            RaiseEvent(handlers, e);
        }
        //function AddEventHandler_To_Frames_Window_MouseDown(handler) {
        //    window_mousedown$handlers[window_mousedown$handlers.length] = handler;
        //}

        $j.RegisterFrame = RegisterFrame;

        window.$j = $j;


        var top = GetTopWindow(window);

        if (window == top) {
            window.jwf$frameEvents = new Object();
            window.jwf$frameEvents["mousedown"] = new LinkedList();
            window.jwf$frameEvents["mousemove"] = new LinkedList();
            window.jwf$frameEvents["mouseup"] = new LinkedList();
        }

        RegisterFrame(window);


        function LinkedList() {

            this.first = null;
            this.last = null;
            this.current = null;
        }

        function LinkedListNode(value) {
            this.before = null;
            this.next = null;

            this.value = value;
        }

        LinkedList.prototype.Add = function Add(value) {
            var node = new LinkedListNode(value);

            if (this.last) {
                this.last.next = node;
                node.before = this.last;
                this.last = node;

                return;
            }

            this.first = node;
            this.last = node;
        }

        LinkedList.prototype.Remove = function Remove(node) {

            if (node == this.first && node == this.last) {
                this.first = null;
                this.last = null;


            }

            else if (node == this.first) {

                this.first = node.next;


            }

            else if (node == this.last) {

                this.last = node.before;


            }
            else {
                node.before.next = node.next;
                node.next.before = node.before;
            }

            if (this.current == node)
                this.current = node.before;
        }

        LinkedList.prototype.MoveToStart = function MoveToStart() {
            this.current = null;
        }

        LinkedList.prototype.MoveNext = function MoveNext() {
            if (this.current == null) {
                if (this.first == null)
                    return false;

                this.current = this.first;
                return true;
            }

            if (this.current.next != null) {
                this.current = this.current.next;
                return true;
            }

            return false;
        }

        LinkedList.prototype.Current = function Current() {
            return this.current;
        }


        var _isFocusGot;
        var _focusedControl;

        $j.TryGetFocus = TryGetFocus;

        function TryGetFocus(ctrl) {

            if (_isFocusGot)
                return;

            _focusedControl = ctrl;
            _isFocusGot = true;
        }

        $j.FocusedControl = function FocusedControl() {

            if (_focusedControl)
                return _focusedControl;

            return window;

        }

        window.addEventListener("mousedown", function () {

            TryGetFocus(window);

            _isFocusGot = false;

        });

        $j.UnFocus = function UnFocus(ctrl)
        {
            if (ctrl != _focusedControl)
                return;

            _focusedControl = null;
            _isFocusGot = false;
        }
    }
)();




