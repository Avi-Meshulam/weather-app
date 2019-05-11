'use strict';

// Trims leading and trailing input string parameter
String.prototype.trim = function (str = ' ') {
    let result = this.toString();

    // trim leading occurrences
    while(result.substr(0, str.length) === str) {
        result = result.substr(str.length)
    }

    // trim trailing occurrences
    while (result.substr(-(str.length)) === str) {
        result = result.substr(0, result.length - str.length);
    }

    return result;
};

const contentTypes = new Map();
contentTypes.set('js', 'text/javascript');
contentTypes.set('json', 'application/json');
contentTypes.set('ico', 'image/x-icon');
['html', 'css'].forEach(ext => contentTypes.set(ext, `text/${ext}`));
['gif', 'png', 'jpg'].forEach(ext => contentTypes.set(ext, `image/${ext}`));
['txt', ''].forEach(ext => contentTypes.set(ext, 'text/plain'));

// return Content-Type http attribute according to file's extension
function getContentType(fileName = '.') {
    const fileExt = fileName.split('.')[1].toLowerCase() || '';
    return contentTypes.get(fileExt);
}

// append parameters to a base url
function buildUrl(baseUrl, ...params) {
    return params.reduce((p1, p2) => p1 + `&${p2}`, baseUrl);
}

function mergeObjects(...objects) {
    return objects.reduce((obj1, obj2) => Object.assign({ ...obj1 }, { ...obj2 }));
}

function buildHeader(contentType, ...objects) {
    return mergeObjects({'Content-Type': contentType}, ...objects)
}

module.exports = {getContentType, buildHeader, buildUrl};
