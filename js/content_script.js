function doTask() {
    Task.init();
    var pageInfo = Task.getPageInfo();
    chrome.extension.sendMessage(
        JSON.stringify(pageInfo),
        // pageInfo.toJSONString(),
        function(response) {
            if (response == "checkError") {
                doTask();
            }
            else if (!Task.isLastPage()) {
                window.location.href = Task.getNextUrl();
            }
            else {
                chrome.extension.sendMessage("stop", function(response) {});
            }
        }
    );
}

var Task = {
    "fontElementArray": [],
    "pElementArray": [],
    "init": function() {
        this.fontElementArray = [];
        this.pElementArray = [];
        var liArray = document.getElementsByClassName('pagelist')[0].getElementsByTagName('li');
        this.nextpage = liArray[liArray.length - 1].getElementsByTagName('a')[0].getAttribute('href');

        this.fontElementArray = document.getElementsByTagName("font");
        this.nextTitle = document.getElementsByClassName("fenxianga")[0]
            .getElementsByTagName("a")[0];
        console.log(this.fontElementArray);
        var bigImgDiv = document.getElementsByClassName('big_img')[0];
        this.imgElementArray = bigImgDiv.getElementsByTagName("img");
        console.log(this.imgElementArray);
    },
    "getCurrentTitle": function() {
        var re = /(([a-zA-Z]|[\u4e00-\u9fa5])*)((\(\d\))?)/;
        return document.title.match(re)[1];
    },
    "getNextTitle": function() {
        return this.getTitleShort(new String(this.nextTitle.innerHTML));
    },
    "getNextUrl": function() {
        return this.nextpage;
    },
    "getTitleShort": function(titleString) {
        return new String(titleString.slice(0, -4));
    },
    "getPageInfo": function() {
        var imgSrcArray = [];
        var pageInfoObj = {};
        for (var i = 0; i < this.imgElementArray.length; i++) {
            console.log("scan to " + this.imgElementArray[i].src);
            imgSrcArray.push(this.imgElementArray[i].src);
        }
        pageInfoObj.imgSrcArray = imgSrcArray;
        pageInfoObj.title = this.getCurrentTitle();
        return pageInfoObj;
    },
    "isLastPage": function() {
        return this.nextpage === '#';
    }
}

console.log("enter content_script.js");
function checkIsAutoRun(autoRunCallback) {
    chrome.extension.sendMessage("checkIsAutoRun", function(response) {
        var isAutoRun = response;
        if (isAutoRun === true) {
            autoRunCallback();
        }
    });
}

checkIsAutoRun(doTask);

function getTitleShort(titleString) {
    return new String(titleString.slice(0, -4));
}
