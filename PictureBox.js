(
    function ()
    {
        $j.RegisterControlType("J:PICTUREBOX", PictureBox);

        function PictureBox(jelemt)
        {

            this.playInterval = 5000;
            this.stepInterval = 100;

            if (jelemt) {
                var width = jelemt.getAttribute("Width");
                var height = jelemt.getAttribute("Height");
            }

            if (width)
                this.width = width;//parseInt(width.replace("px", ""));
            else
                this.width = "200px";

            if (height)
                this.height = height;//parseInt(height.replace("px", ""));
            else
                this.height = "300px";


            var elemt = document.createElement("div");

            elemt.style.display = "inline-block";
            elemt.style.width = this.width;
            elemt.style.height = this.height;
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

        $j.PictureBox = function CreatePictureBox(id) {
            var ctrl = new PictureBox();

            if (id) {
                jwf$RegiterControl(ctrl, id);
            }

            return ctrl;
        }

        PictureBox.prototype = $j.Control();

        PictureBox.prototype.Width = function Width(width) {
            if (!width)
                return this.width;

            throw "jWebForm Error: 暂不支持 设置 Width 。"
            //this.width = parseInt(width.replace("px", ""));

            //this.elemt.style.width = this.width + "px";
        }

        PictureBox.prototype.Height = function Height(height) {
            if (!height)
                return this.height;

            throw "jWebForm Error: 暂不支持 设置 Height 。"
            //this.height = parseInt(height.replace("px", ""));

            //this.elemt.style.height = this.height + "px";
        }

        PictureBox.prototype.LoadImages = function LoadImages(urlList, callback) {

            this.imgList = [];

            this.imgLoadCount = 0;

            this.imgCount = urlList.length;


            for (var i = 0; i < urlList.length; i++) {
                var url = urlList[i];
                var img = document.createElement("img");

                img.style.width = this.width;// + "px";
                img.style.height = this.height;// + "px";

                img.src = url;

                img.addEventListener("load", function PlayImageOnLoad(e) {
                    var img = e.srcElement;
                    var picBox = img.jwfObj;

                    picBox.imgLoadCount++;

                    if (picBox.imgLoadCount == picBox.imgCount) {
                        picBox.imgDiv.appendChild(picBox.imgList[0]);

                        callback(picBox);
                    }
                });

                img.jwfObj = this;

                if (i > 0) {
                    img.style.display = "none";
                }

                this.imgList[this.imgList.length] = img;
                this.hidden.appendChild(img);
            }
        }

        PictureBox.prototype.Play = function Play() {
            this.imgIndex = 1;

            window.setTimeout(PlayOneImage, this.playInterval, this);
        }

        function PlayOneImage(picBox) {
            var imgDiv = picBox.imgDiv;

            var img = picBox.imgList[picBox.imgIndex];

            img.style.marginTop = (picBox.elemt.offsetHeight * -1) + "px";

            var imgOld = picBox.imgDiv.childNodes[0];

            imgDiv.insertBefore(img, imgOld);

            img.style.display = "";

            picBox.stepCount = 0;

            picBox.playOneImageStepHandle = window.setInterval(PlayOneImageStep, picBox.stepInterval, picBox);
        }

        function PlayOneImageStep(picBox) {
            var imgDiv = picBox.imgDiv;

            var top = picBox.elemt.offsetHeight * (1 - picBox.stepCount / 10);

            if (top < 0)
                top = 0;

            var img = imgDiv.childNodes[0];
            var imgOld = imgDiv.childNodes[1];

            img.style.marginTop = (top * -1) + "px";

            if (top == 0) {
                window.clearInterval(picBox.playOneImageStepHandle);

                imgDiv.removeChild(imgOld);
                imgOld.style.display = "none";

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
