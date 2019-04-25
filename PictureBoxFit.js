(
    function ()
    {
        $j.RegisterControlType("J:PICTUREBOXFIT", PictureBoxFit);

        function PictureBoxFit(jelemt)
        {

            this.playInterval = 5000;
            this.stepInterval = 100;


            if (jelemt) {
                var width = jelemt.getAttribute("Width");
                var height = jelemt.getAttribute("Height");
            }

            if (width)
                this.width = width;
            else
                this.width = "200px";

            if (height)
                this.height = height;
            else
                this.height = "300px";


            var elemt = document.createElement("div");

            elemt.style.display = "inline-block";
            elemt.style.width = this.width;
            elemt.style.height = this.height;
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

                if (picBox.isFirstImg)
                {
                    picBox.isFirstImg = false;
                    window.setTimeout(PlayOneImage, picBox.playInterval, picBox);
                    return;
                }
                    
                var elemt = picBox.elemt;
                var div0 = elemt.childNodes[0];

                var div1 = elemt.childNodes[1];

                console.info("div1.offsetHeight " + div1.offsetHeight);
                div0.style.marginTop = (-1 * div1.offsetHeight) + "px";;
                div0.style.display = "";

                console.info("PlayOneImageStep " + PlayOneImageStep);
                picBox.stepCount = 0;
                picBox.playOneImageStepHandle = window.setInterval(PlayOneImageStep, picBox.stepInterval, picBox);

            })

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

        PictureBoxFit.prototype = $j.Control();

        PictureBoxFit.prototype.Width = function Width(width) {

            if (!width)
                return this.width;

            this.width = width;

            this.elemt.style.width = width;
        }

        PictureBoxFit.prototype.Height = function Height(height) {

            if (!height)
                return this.height;
            
            this.height = height;

            this.elemt.style.height = height;
        }

        PictureBoxFit.prototype.Images = function Images(urlList)
        {
            if (!urlList)
                return this.urlList;

            this.currentImgIndex = 0;

            this.urlList = [];

            for (var i = 0; i < urlList.length; i++) {

                this.urlList[i] = urlList[i];
            }
        }

        PictureBoxFit.prototype.Play = function Play()
        {
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

                window.setTimeout(PlayOneImage, picBox.playInterval, picBox);

                return;
            }

            picBox.stepCount++;

        }
    }
)();
