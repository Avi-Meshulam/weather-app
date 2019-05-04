'use strict';

const contentTypes = new Map();
contentTypes.set('html', 'text/html');
contentTypes.set('js', 'text/javascript');
contentTypes.set('css', 'text/css');
contentTypes.set('json', 'application/json');
contentTypes.set('txt', 'text/plain');
contentTypes.set('', 'text/plain');  // default for files with no extension

function getContentType(fileName) {
    const fileExt = fileName.split('.')[1].toLowerCase() || '';
    return contentTypes.get(fileExt);
}

HTMLElement.prototype.removeChildren = function() {
    while (this.firstChild) {
        this.removeChild(this.firstChild);
    }
};

function loadLocalFile(fileName) {
    const xhr = new XMLHttpRequest();
    xhr.overrideMimeType(getContentType(fileName));
    return new Promise((resolve, reject) => {
        xhr.open('GET', fileName, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                resolve(xhr.responseText);
            }
        };
        xhr.onerror = () => reject(xhr.responseText);
        xhr.send(null);
    });
}

function buildUrl(baseUrl, ...params) {
    return params.reduce((p1, p2) => p1 + `&${p2}`, baseUrl);
}

const caseInsensitiveCompare = (a, b) =>
    a.localeCompare(b, undefined, {sensitivity: 'base'});


export {loadLocalFile, buildUrl, caseInsensitiveCompare}
