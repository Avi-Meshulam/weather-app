'use strict';

const http = require('http');
const url = require('url');
const _ = require('lodash');
const io = require('./io');
const getContentType = require('./utils').getContentType;
const buildHeader = require('./utils').buildHeader;
const getWeatherByCityId = require('./weather').getByCityId;

const PUBLIC_FOLDER = 'public';
const DEFAULT_PUBLIC_RESOURCE = 'index.html';
const PORT = 8080;

const filesCache = new Map();

cacheFiles()
    .then(() =>
        http.createServer(handleRequest).listen(PORT, () => {
            console.log(`Client is available at http://localhost:${PORT}`);
        }));

// Cache all files in public folder
async function cacheFiles() {
    const files = await io.readdir(PUBLIC_FOLDER);
    const readPromises = [];
    files.forEach(file =>
        readPromises.push(io.readFile(`${PUBLIC_FOLDER}/${file}`)
            .then(data => filesCache.set(file, data))
            .catch(err => err)  // prevent breaking on rejection
        ));
    await Promise.all(readPromises);
}

function handleRequest(req, res) {
    switch (req.method.toUpperCase()) {
        case 'OPTIONS':
            res.writeHead(200);
            res.end();
            break;
        case 'GET':
            handleGetRequest(req, res);
            break;
        default:
            break;
    }
}

function handleGetRequest(req, res) {
    let {path, query} = parseRequest(req);

    // weather/{cityId}
    let result = /\bweather\b\/(\d+)/i.exec(path);
    if (result) {
        getWeatherByCityId(Number(result[1]))
            .then(data => {
                res.end(data);
                res.writeHead(200, buildHeader(getContentType('*.json')));
            });
    } else if (filesCache.has(path)) {
        res.writeHead(200, buildHeader(getContentType(path)));
        res.end(filterJSON(filesCache.get(path), query));
    } else {
        handleNewFileRequest(res, path, query);
    }
}

function parseRequest(req) {
    const reqObj = url.parse(req.url, true);
    const pathname = reqObj.pathname.trim('/').toLowerCase();

    return {
        path: pathname || DEFAULT_PUBLIC_RESOURCE,
        query: reqObj.query
    }
}

function handleNewFileRequest(res, fileName, query) {
    io.readFile(`${PUBLIC_FOLDER}/${fileName}`)
        .then(data => {
            filesCache.set(fileName, data);
            const contentType = getContentType(fileName);
            res.writeHead(200, buildHeader(contentType));
            res.write(filterJSON(data, query));
        })
        .catch(err => {
            let status = err.code === 'ENOENT' ? 404 : 500;
            res.writeHead(status, buildHeader(getContentType()));
            res.write(err.message);
        })
        .finally(() =>
            res.end());
}

function filterJSON(stringifiedJSON, filtersObj) {

    //#region Validations
    if (!filtersObj || _.isEmpty(filtersObj))
        return stringifiedJSON;

    // is JSON structure?
    let parsedJSON;
    try {
        parsedJSON = JSON.parse(stringifiedJSON);
    } catch (error) {
        return stringifiedJSON;
    }

    // is Array?
    if (!Array.isArray(parsedJSON))
        parsedJSON = [parsedJSON];
    //#endregion

    return JSON.stringify(parsedJSON.filter(item => {
        for (const key in filtersObj) {
            if (Object.prototype.hasOwnProperty.call(filtersObj, key)) {
                // deliberately using != and not !== in order to allow implicit conversion when needed
                if (item[key] != filtersObj[key]) {
                    return false;
                }
            }
        }
        return true;
    }));
}
