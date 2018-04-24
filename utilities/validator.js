var _this = this;

exports.validateEmail = function (email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

exports.refineURL = function (url) {
    var currURL = url;
    var afterDomain = currURL.substring(currURL.lastIndexOf('/') + 1);
    var beforeQueryString = afterDomain.split("?")[0];
    if (beforeQueryString == "index.html" || beforeQueryString == "index.php") {
        return currURL.substring(0, currURL.lastIndexOf('/') + 1);
    }
    else {
        return currURL.substring(0, currURL.lastIndexOf('/') + 1) + beforeQueryString;
    }
}