var CustomizeTwitterWidget = function(data) {
    var notNumeric = function(n) {
        return isNaN(parseFloat(n)) && isFinite(n);
    };

    var createCssElement = function(doc, url) {
        var link = doc.createElement("link");
        link.href = url;
        link.rel = "stylesheet";
        link.type = "text/css";
        return link;
    };

    var embedCss = function(doc, url) {
        var link = createCssElement(doc, url);
        var head = doc.getElementsByTagName("head")[0];
        head.appendChild(link);
    };

    var contains = function(haystack, needle) {
        return haystack.indexOf(needle) >= 0;
    };

    var isTwitterFrame = function(frame) {
        var clsList = frame.frameElement.classList;
        for (var i = 0; i < clsList.length; i++) {
            if (clsList[i] === "twitter-widget") {
                return true;
            }
        }
        return false;
    }

    /**
     * The main event loop - calls itself if we haven't found all of the frames
     * yet.
     */
    var evaluate = function(framesWithStyles, widgetCount, timeoutLength) {
        for (var i = 0; i < frames.length; i++) {
            if (isTwitterFrame(frames[i]) &&
                !contains(framesWithStyles, frames[i].name)
            ) {
                embedCss(frames[i].document, data.url);
                framesWithStyles.push(i);
            }
        }

        if (framesWithStyles.length < widgetCount) {
            setTimeout(function() {
                evaluate(framesWithStyles);
            }, timeoutLength);
        }
    }

    if (data.url === undefined) {
        console.log("need to specify a link to your CSS file. quitting");
        return;
    }
    var widgetCount;
    if (data.widget_count === undefined || notNumeric(data.widget_count)) {
        widgetCount = 1;
    } else {
        widgetCount = data.widget_count;
    }
    var timeoutLength;
    if (data.timeout_length === undefined || notNumeric(data.timeout_length)) {
        timeoutLength = 300;
    } else {
        timeoutLength = data.timeout_length;
    }

    setTimeout(function() {
        evaluate([], widgetCount, timeoutLength);
    }, timeoutLength);
}

