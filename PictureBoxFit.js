(
    function ()
    {
        $j.RegisterControlType("J:PICTUREBOXFIT", PictureBoxFit);

        _playInterval = 5000;

        function PictureBoxFit(jelemt)
        {

            //this.playInterval = 5000;
            this.stepInterval = 100;

            var width;
            var height;

            if (jelemt) {
                width = jelemt.getAttribute("Width");
                height = jelemt.getAttribute("Height");
            }

            if (!width)
                width = "200px";

            if (!height)
                height = "300px";


            var elemt = document.createElement("div");

            elemt.style.display = "inline-block";
            elemt.style.width = width;
            elemt.style.height = height;
            elemt.style.border = "solid 1px lightblue";
            elemt.style.overflow = "hidden";


            this.elemt = elemt;
            elemt.jwfObj = this;

            var div0 = CreateDivImg(this);
            div0.style.display = "none";

            var div1 = CreateDivImg(this);

            elemt.appendChild(div0);
            elemt.appendChild(div1);

        }

        function CreateDivImg(picBox)
        {
            var div = document.createElement("div");
            div.style.width = "100%";
            div.style.height = "100%";

            var img = document.createElement("img");

            //  适应 img 自身比例
            img.style.width = "auto";
            img.style.height = "auto";
            img.style.maxWidth = "100%";
            img.style.maxHeight = "100%";

            //img.style.width = "100%";
            //img.style.height = "100%";

            img.addEventListener("load", function () {

                if (picBox.isFirstImg) {
                    picBox.isFirstImg = false;
                    window.setTimeout(PlayOneImage, _playInterval, picBox);
                    return;
                }

                var elemt = picBox.elemt;
                var div0 = elemt.childNodes[0];

                var div1 = elemt.childNodes[1];

                div0.style.marginTop = (-1 * div1.offsetHeight) + "px";;
                div0.style.display = "";

                picBox.stepCount = 0;
                picBox.playOneImageStepHandle = window.setInterval(PlayOneImageStep, picBox.stepInterval, picBox);

            });

            div.appendChild(img);

            return div;
        }

        $j.PictureBoxFit = function CreatePictureBoxFit(id) {
            var ctrl = new PictureBoxFit();

            if (id) {
                $j.RegisterControl(ctrl, id);
            }

            return ctrl;
        }

        $j.PictureBoxFit.PlayInterval = function PlayInterval(playInterval)
        {
            if (!playInterval)
                return _playInterval;

            _playInterval = playInterval;
        }

        PictureBoxFit.prototype = $j.Control();

        PictureBoxFit.prototype.Width = function Width(width) {

            if (!width)
                return this.elemt.style.width;

            this.elemt.style.width = width;
        }

        PictureBoxFit.prototype.Height = function Height(height) {

            if (!height)
                return this.elemt.style.height;

            this.elemt.style.height = height;
        }

        PictureBoxFit.prototype.Images = function Images(urlList)
        {
            if (!urlList)
                return this.urlList;

            if (urlList.length == 0)
                throw "urlList.length 不能为 0 。";

            this.currentImgIndex = 0;

            this.urlList = [];

            for (var i = 0; i < urlList.length; i++) {

                this.urlList[i] = urlList[i];
            }
        }

        PictureBoxFit.prototype.Play = function Play()
        {
            if (!this.urlList)
                throw "请先设置 Images(urlList) 属性 。";

            if (this.urlList.length == 0)
                throw "this.urlList.length 不能为 0 。";

            var elemt = this.elemt;

            var div1 = elemt.childNodes[1];

            var img = div1.childNodes[0];

            this.isFirstImg = true;

            img.src = this.urlList[0];
        }

        function PlayOneImage(picBox)
        {
            picBox.currentImgIndex++;

            if (picBox.currentImgIndex >= picBox.urlList.length)
                picBox.currentImgIndex = 0;

            var elemt = picBox.elemt;

            var div = elemt.childNodes[0];

            var img = div.childNodes[0];

            img.src = picBox.urlList[picBox.currentImgIndex];
        }

        function PlayOneImageStep(picBox) {

            var elemt = picBox.elemt;

            var div0 = elemt.childNodes[0];
            var div1 = elemt.childNodes[1];

            var top = div1.offsetHeight * (1 - picBox.stepCount / 10);

            if (top < 0)
                top = 0;

            div0.style.marginTop = (top * -1) + "px";

            if (top == 0) {

                window.clearInterval(picBox.playOneImageStepHandle);

                div1.style.display = "none";
                elemt.insertBefore(div1, div0);

                picBox.stepCount = 0;

                picBox.imgIndex++;

                if (picBox.imgIndex == picBox.imgCount) {
                    picBox.imgIndex = 0;
                }

                window.setTimeout(PlayOneImage, _playInterval, picBox);

                return;
            }

            picBox.stepCount++;

        }

        PictureBoxFit.prototype.CurrentImageUrl = function CurrentImageUrl()
        {
            return this.elemt.childNodes[1].childNodes[0].src;
        }
    }
)();
