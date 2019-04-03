(
    function ()
    {
        jwf$ControlTypes["J:EDITAREA"] = EditArea;

        function EditArea(jelemt)
        {

            if (jelemt)
            {
                var width = jelemt.getAttribute("Width");
                var minHeight = jelemt.getAttribute("MinHeight");
            }

            if (width)
                this.width = width;

            if (minHeight)
                this.minHeight = minHeight;


            var elemt = document.createElement("div");

            elemt.style.boxSizing = "border-box";
            elemt.style.width = this.width;
            elemt.style.minHeight = this.minHeight;
            elemt.style.position = "relative";
            elemt.style.padding = this.editAreaPadding;
            elemt.style.backgroundColor = "white";

            this.elemt = elemt;

            var ifr = document.createElement("iframe");
            ifr.style.width = "100%";
            ifr.style.height = "100%";
            ifr.style.position = "absolute";
            ifr.style.top = "0px";
            ifr.style.left = "0px";
            ifr.style.border = "0px"
            ifr.style.boxSizing = "border-box";
            ifr.style.zIndex = -1;

            elemt.appendChild(ifr);

            this.ifr = ifr;

            var div = document.createElement("div");

            elemt.appendChild(div);

            this.div = div;

            var txtBoxForInput = document.createElement("input");

            txtBoxForInput.style.position = "absolute";
            txtBoxForInput.style.width = "1px";
            txtBoxForInput.style.height = "1px";
            txtBoxForInput.style.zIndex = -1;

            elemt.appendChild(txtBoxForInput);

            this.txtBoxForInput = txtBoxForInput;

            var spanIcon = document.createElement("span");

            spanIcon.style.display = "block";
            spanIcon.style.backgroundColor = "black";
            spanIcon.style.width = "1px";
            spanIcon.style.position = "absolute";

            elemt.appendChild(spanIcon);

            this.spanIcon = spanIcon;

            var editArea = this;

            elemt.addEventListener("mousedown",
                function div_mousedownHandler() {
                    div_mousedown(editArea);
                }
            );

            elemt.addEventListener("mousemove",
                function div_mousemoveHandler() {
                    div_mousemove(editArea);
                }
            );

            window.addEventListener("mouseup",
                function div_mouseupHandler() {
                    div_mouseup(editArea);
                }
            );

            txtBoxForInput.addEventListener("input",
                function txtBoxForInput_inputHandler() {
                    if (editArea.isCompositionStart == true)
                        return;
                    txtBoxForInput_input(editArea);
                }
            );

            txtBoxForInput.addEventListener("keydown",
                function txtBoxForInput_keydownHandler() {
                    txtBoxForInput_keydown(editArea);
                }
            );

            txtBoxForInput.addEventListener("compositionstart",
                function txtBoxForInput_compositionstart() {
                    editArea.isCompositionStart = true;
                });

            txtBoxForInput.addEventListener("compositionend",
                function () {
                    editArea.isCompositionStart = false;
                    txtBoxForInput_input(editArea);
                });
        }

        window.$j.EditArea = function EditArea(id) {
            var ctrl = new jwf$EditArea();

            if (id) {
                jwf$RegiterControl(ctrl, id);
            }

            return ctrl;
        }

        EditArea.prototype = new jwf$Control();

        EditArea.prototype.editAreaPadding = "20px";
        EditArea.prototype.txtBoxForInputTopOffset = 10;
        EditArea.prototype.defaultFontSize = "14px";

        EditArea.prototype.insertPosition = null;
        EditArea.prototype.isDivMouseDown = false;
        EditArea.prototype.isMouseMoveInMouseDown = false;

        EditArea.prototype.rowArray = null;
        EditArea.prototype.isComposingChanged = true;

        EditArea.prototype.beginX = null;
        EditArea.prototype.beginY = null;
        EditArea.prototype.span1 = null;
        EditArea.prototype.span2 = null;
        EditArea.prototype.txtBoxForInput = null;
        EditArea.prototype.spanIcon = null;

        EditArea.prototype.isCompositionStart = false;

        EditArea.prototype.Init = Init;
        EditArea.prototype.MinHeight = MinHeight;

        function Init()
        {
            var editArea = this;

            this.ifr.contentWindow.addEventListener("resize", function ()
            {
                editArea.isComposingChanged = true;

                setSpanIcon(editArea);
            });

            setSpanIcon(this);
            spanIcon_Action(this);
        }

        function MinHeight(minHeight) {
            if (!minHeight)
                return this.minHeight;

            this.minHeight = minHeight;

            this.elemt.style.minHeight = minHeight;
        }

        function createSpanSpace() {
            var spanSpace = createSpan();
            spanSpace.innerHTML = "&nbsp;";
            spanSpace.style.display = "inline-block";

            return spanSpace;
        }

        function txtBoxForInput_keydown(editArea) {
            var e = window.event;

            if (e.keyCode == 8) {
                doBackspace(editArea);
            }
            else if (e.keyCode == 13) {
                doEnter(editArea);
            }
        }

        function doEnter(editArea) {

            deleteSelection(editArea);

            var spanBr = createSpan();
            spanBr.jwf$EditArea$IsEnterSpan = true;
            spanBr.innerHTML = "&nbsp;<br />";

            var div = editArea.div;

            div.insertBefore(spanBr, editArea.insertPosition);

            if (editArea.insertPosition == null) {
                spanBr = createSpan();
                spanBr.jwf$EditArea$IsEnterSpan = true;
                spanBr.innerHTML = "&nbsp;<br />";

                div.insertBefore(spanBr, editArea.insertPosition);

                editArea.insertPosition = spanBr;
            }

            editArea.isComposingChanged = true;

            setSpanIcon(editArea);
        }

        function doBackspace(editArea) {
            var div = editArea.div;

            if (div.childNodes.length == 0)
                return;

            var selectedSpanArray = getSelectedSpanArray(editArea);

            if (selectedSpanArray.length > 0) {
                deleteSelection(editArea);
            }
            else {
                var deleteSpan;

                if (editArea.insertPosition == null) {
                    deleteSpan = div.lastChild;
                }
                else {
                    deleteSpan = editArea.insertPosition.previousElementSibling;
                }

                if (deleteSpan != null) {
                    div.removeChild(deleteSpan);
                }
            }

            editArea.isComposingChanged = true;

            setSpanIcon(editArea);
        }

        function getE(editArea)
        {
            var e = window.event;

            var newE = new Object();

            var elemt = editArea.elemt;
            
            if (e.srcElement == elemt)
            {
                newE.clientX = e.offsetX;
                newE.clientY = e.offsetY;
            }
            else
            {
                newE.clientX = e.offsetX + e.srcElement.offsetLeft; 
                newE.clientY = e.offsetY + e.srcElement.offsetTop;
            }

            return newE;
        }

        function div_mousedown(editArea) {

            editArea.isDivMouseDown = true;
            editArea.isMouseMoveInMouseDown = true;

            unselectSpanAll(editArea);

            var e = getE(editArea);

            editArea.beginX = e.clientX;
            editArea.beginY = e.clientY;

            var rowArray = getRowArray(editArea);

            var row;
            var span;
            var tempInsertPosition = null;

            for (var i = 0; i < rowArray.length; i++) {
                row = rowArray[i];

                if (e.clientY <= row.bottomY) {
                    tempInsertPosition = getSpanOnMouseFromRowForSetIcon(editArea, row, e.clientX);
                }

                if (tempInsertPosition != null)
                    break;
            }

            if (tempInsertPosition == editArea.div.lastChild)
                tempInsertPosition = null;

            editArea.insertPosition = tempInsertPosition;

            setSpanIcon(editArea);
        }

        function getRowArray(editArea) {

            if (editArea.isComposingChanged == false) {
                return editArea.rowArray;
            }

            console.info("compute row array .");

            var tempRowArray = [];
            var span;

            var div = editArea.div;

            var firstSpan = div.firstChild;

            var row;

            var j = 0;

            for (var i = 0; i < div.childNodes.length; i++) {
                span = div.childNodes[i];

                if (span.offsetLeft == firstSpan.offsetLeft) {
                    row = { beginSpan: span, endSpan: null };
                }

                if (row && (span.nextElementSibling == null || span.nextElementSibling.offsetLeft == firstSpan.offsetLeft)) {
                    row.endSpan = span;

                    tempRowArray[j] = row;

                    j++;
                }
            }

            var maxBottomY;

            for (var i = 0; i < tempRowArray.length; i++) {
                maxBottomY = null;

                row = tempRowArray[i];

                span = row.beginSpan;

                while (true) {
                    if (maxBottomY == null) {
                        maxBottomY = span.offsetTop + span.offsetHeight;
                    }
                    else {
                        if (maxBottomY < (span.offsetTop + span.offsetHeight)) {
                            maxBottomY = span.offsetTop + span.offsetHeight;
                        }
                    }

                    if (span == row.endSpan)
                        break;

                    span = span.nextElementSibling;
                }

                row.bottomY = maxBottomY;
            }

            editArea.rowArray = tempRowArray;
            editArea.isComposingChanged = false;

            return tempRowArray;
        }

        function div_mousemove(editArea) {

            editArea.txtBoxForInput.focus();

            if (editArea.isDivMouseDown == false)
                return;

            //  判断是不是 mousedown 时候的 mousemove 事件，如果是则不进行 拉选 操作
            if (editArea.isMouseMoveInMouseDown == true) {
                editArea.isMouseMoveInMouseDown = false;
                return;
            }

            unselectSpanAll(editArea);

            var e = getE(editArea);

            var rowArray = getRowArray(editArea);

            var row;
            var span;

            var x1;
            var y1;
            var x2;
            var y2;

            for (var i = 0; i < rowArray.length; i++) {
                row = rowArray[i];

                if (x1 == null) {
                    if (e.clientY <= row.bottomY && editArea.beginY <= row.bottomY) {
                        if (e.clientX < editArea.beginX) {
                            x1 = e.clientX;
                            y1 = e.clientY;
                            x2 = editArea.beginX;
                            y2 = editArea.beginY;
                        }
                        else {
                            x1 = editArea.beginX;
                            y1 = editArea.beginY;
                            x2 = e.clientX;
                            y2 = e.clientY;
                        }

                        editArea.span1 = getSpanOnMouseFromRowForSelect(editArea, row, x1);

                        editArea.span2 = getSpanOnMouseFromRowForSelect(editArea, row, x2);

                        break;
                    }
                    else {
                        if (e.clientY <= row.bottomY && !(editArea.beginY <= row.bottomY)) {
                            x1 = e.clientX;
                            y1 = e.clientY;
                            x2 = editArea.beginX;
                            y2 = editArea.beginY;
                        }
                        else if (!(e.clientY <= row.bottomY) && editArea.beginY <= row.bottomY) {
                            x1 = editArea.beginX;
                            y1 = editArea.beginY;
                            x2 = e.clientX;
                            y2 = e.clientY;
                        }

                        editArea.span1 = getSpanOnMouseFromRowForSelect(editArea, row, x1);

                        continue;
                    }
                }
                else {
                    if (y2 <= row.bottomY) {
                        editArea.span2 = getSpanOnMouseFromRowForSelect(editArea, row, x2, true);

                        break;
                    }
                }
            }

            var div = editArea.div;

            if (editArea.span1 != null && editArea.span2 == null) {
                editArea.span2 = div.lastChild;
            }

            var selectedSpanArray = getSelectedSpanArray(editArea);

            for (var i = 0; i < selectedSpanArray.length; i++) {
                var span = selectedSpanArray[i];
                selectSpan(span);
            }
        }

        function getSpanOnMouseFromRowForSelect(editArea, row, x, is_x2_and_x1x2notInOneRow) {
            var span;

            span = row.beginSpan;

            if (x < span.offsetLeft) {
                if (is_x2_and_x1x2notInOneRow == true)
                    return span.previousElementSibling == null ? span : span.previousElementSibling;
                else
                    return span;
            }

            span = row.endSpan;

            if (x > (span.offsetLeft + span.offsetWidth)) {
                return span;
            }

            span = row.beginSpan;

            while (true) {
                if (x >= span.offsetLeft && x <= (span.offsetLeft + span.offsetWidth)) {
                    return span;
                }

                if (span == row.endSpan)
                    break;

                span = span.nextElementSibling;
            }
        }

        function getSpanOnMouseFromRowForSetIcon(editArea, row, x) {
            var span;

            span = row.beginSpan;

            if (x < span.offsetLeft) {
                return span;
            }

            span = row.endSpan;

            if (x > (span.offsetLeft + span.offsetWidth)) {
                return span;
            }

            span = row.beginSpan;

            while (true) {
                if (x >= span.offsetLeft && x < (span.offsetLeft + span.offsetWidth / 2)) {
                    return span;
                }
                else if (x >= (span.offsetLeft + span.offsetWidth / 2) && x <= (span.offsetLeft + span.offsetWidth)) {
                    return span.nextElementSibling;
                }

                if (span == row.endSpan)
                    break;

                span = span.nextElementSibling;
            }
        }

        function div_mouseup(editArea) {
            editArea.isDivMouseDown = false;
        }

        function selectSpan(span) {
            span.style.backgroundColor = "blue";
            span.style.color = "white";
        }

        function unselectSpanAll(editArea) {
            var selectedSpanArray = getSelectedSpanArray(editArea);

            for (var i = 0; i < selectedSpanArray.length; i++) {
                unselectSpan(selectedSpanArray[i]);
            }

            editArea.span1 = null;
            editArea.span2 = null;
        }

        function unselectSpan(span) {
            span.style.backgroundColor = "";

            if (span.myColor == undefined || span.myColor == "")
                span.style.color = "";
            else
                span.style.color = span.myColor;
        }

        function deleteSelection(editArea) {
            var selectedSpanArray = getSelectedSpanArray(editArea);

            if (selectedSpanArray.length == 0)
                return;

            editArea.insertPosition = selectedSpanArray[selectedSpanArray.length - 1].nextElementSibling;

            for (var i = 0; i < selectedSpanArray.length; i++) {
                editArea.div.removeChild(selectedSpanArray[i]);
            }

            editArea.span1 = null;
            editArea.span2 = null;
        }

        function getSelectedSpanArray(editArea) {
            var spanArray = [];

            if (editArea.span1 == null || editArea.span2 == null)
                return spanArray;

            spanArray[0] = editArea.span1;

            if (editArea.span1 == editArea.span2)
                return spanArray;

            var nextSpan = editArea.span1.nextElementSibling;

            var i = 1;

            while (true) {
                spanArray[i] = nextSpan;

                if (nextSpan == editArea.span2)
                    break;
                nextSpan = nextSpan.nextElementSibling;

                i++;
            }

            return spanArray;
        }

        function txtBoxForInput_input(editArea) {

            deleteSelection(editArea);

            var div = editArea.div;
            var txtBoxForInput = editArea.txtBoxForInput;

            var span;
            var text;

            for (var i = 0; i < txtBoxForInput.value.length; i++) {
                span = createSpan();

                text = txtBoxForInput.value[i];

                if (text == " ")
                    span.innerHTML = "&nbsp;";
                else
                    span.innerText = text;

                span.style.display = "inline-block";


                div.insertBefore(span, editArea.insertPosition);
            }

            editArea.isComposingChanged = true;

            setSpanIcon(editArea);

            txtBoxForInput.value = "";
        }

        function createSpan() {
            var span = document.createElement("span");

            return span;
        }

        function setSpanIcon(editArea) {
            var div = editArea.div;

            var spanIcon = editArea.spanIcon;

            var txtBoxForInput = editArea.txtBoxForInput;

            if (div.childNodes.length == 0) {
                var spanSpace = createSpanSpace();
                div.appendChild(spanSpace);

                spanIcon.style.top = spanSpace.offsetTop + "px";
                spanIcon.style.left = spanSpace.offsetLeft + "px";
                spanIcon.style.height = spanSpace.offsetHeight + "px";
                txtBoxForInput.style.top = (spanSpace.offsetTop + spanSpace.offsetHeight + editArea.txtBoxForInputTopOffset) + "px";
                txtBoxForInput.style.left = spanSpace.offsetLeft + "px";

                div.removeChild(spanSpace);
                return;
            }

            var lastSpan = div.lastChild;

            if (editArea.insertPosition == null && lastSpan.jwf$EditArea$IsEnterSpan == true) {
                editArea.insertPosition = lastSpan;
            }

            if (editArea.insertPosition == null) {
                spanIcon.style.top = lastSpan.offsetTop + "px";
                spanIcon.style.left = (lastSpan.offsetLeft + lastSpan.offsetWidth) + "px";
                spanIcon.style.height = lastSpan.offsetHeight + "px";

                txtBoxForInput.style.top = (lastSpan.offsetTop + lastSpan.offsetHeight + editArea.txtBoxForInputTopOffset) + "px";
                txtBoxForInput.style.left = (lastSpan.offsetLeft + lastSpan.offsetWidth) + "px";

                return;
            }

            var insertPosition = editArea.insertPosition;

            spanIcon.style.top = insertPosition.offsetTop + "px";
            spanIcon.style.left = insertPosition.offsetLeft + "px";
            spanIcon.style.height = insertPosition.offsetHeight + "px";

            txtBoxForInput.style.top = (insertPosition.offsetTop + insertPosition.offsetHeight + editArea.txtBoxForInputTopOffset) + "px";
            txtBoxForInput.style.left = insertPosition.offsetLeft + "px";
        }

        function spanIcon_Action(editArea) {
            var spanIcon = editArea.spanIcon;

            if (spanIcon.style.display) {
                spanIcon.style.display = "";
                window.setTimeout(spanIcon_Action, 720, editArea);
            }
            else {
                spanIcon.style.display = "none";
                window.setTimeout(spanIcon_Action, 360, editArea);
            }
        }

        function setFontFamily(font) {
            var selectedSpanArray = this.getSelectedSpanArray(editArea);

            for (var i = 0; i < selectedSpanArray.length; i++) {
                selectedSpanArray[i].style.fontFamily = font;
            }

            editArea.isComposingChanged = true;
        }

        function setFontSize(fontSize) {
            var selectedSpanArray = this.getSelectedSpanArray();

            for (var i = 0; i < selectedSpanArray.length; i++) {
                selectedSpanArray[i].style.fontSize = fontSize;
            }

            editArea.isComposingChanged = true;
        }

        function setFontColor(color) {
            var selectedSpanArray = this.getSelectedSpanArray();

            for (var i = 0; i < selectedSpanArray.length; i++) {
                selectedSpanArray[i].style.color = color;
                selectedSpanArray[i].myColor = color;
            }
        }
    }
)();

    
