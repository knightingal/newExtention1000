var isAutoRun = false;

var totalRequest = {};

function checkImgSrcArray(imgSrcArray) {
    var imgNumArray = [];
    var re = /\/(\d+)\.jpg$/;
    for (var imgSrc of imgSrcArray) {
        var imgNum = Number(imgSrc.src.match(re)[1]);
        imgNumArray.push(imgNum);
    }
    console.log(imgNumArray);
    for (var i = 0; i < imgNumArray.length - 1; i++) {
        if (imgNumArray[i + 1] - imgNumArray[i] != 1) {
            return false;
        }
    }
    return true;

}
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {

    if (request === "checkIsAutoRun") {
        sendResponse(isAutoRun);
    } else if (request === "stop" ){
        isAutoRun = false;
        xmlhttp = new XMLHttpRequest()
        console.log(totalRequest);
        xmlhttp.open("POST", "http://127.0.0.1:8000/local1000/urls1000/", true)
        // xmlhttp.open("POST", "http://127.0.0.1:8081/startDownload/", true)
        xmlhttp.setRequestHeader("Content-Type", "application/json");
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState==4) {
                if (xmlhttp.status==200) {
                    console.log("http://127.0.0.1:8081/startDownload/ return "
                        + xmlhttp.responseText)
                }
            }
        }
        xmlhttp.send(JSON.stringify(totalRequest));
        totalRequest = {};
    } else {
        var pageInfo = JSON.parse(request);
        isAutoRun = true;
        var tmpImgSrcArray;
        if (totalRequest["title"] === undefined) {
            totalRequest["title"] = pageInfo["title"];
            tmpImgSrcArray = pageInfo["imgSrcArray"];
        } else if (totalRequest["title"] === pageInfo["title"]) {
            tmpImgSrcArray = totalRequest["imgSrcArray"].concat(pageInfo["imgSrcArray"]);
        }
        var ret = checkImgSrcArray(tmpImgSrcArray);
        console.log(ret);

        if (ret === false) {
            sendResponse("checkError");
        } else {
            totalRequest["imgSrcArray"] = tmpImgSrcArray;
            sendResponse("checkSucc");
        }


    }

});
chrome.browserAction.onClicked.addListener(function(tab) {
    chrome.tabs.executeScript(null, {
        code: "doTask()"
    }, function() {console.log("callback");}

    );

});
