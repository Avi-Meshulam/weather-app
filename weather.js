'use strict';

const fetch = require('node-fetch');
const buildUrl = require('./utils').buildUrl;

const API_TOKEN = '5d96fcae82ff1063cf7e1c1f78882d73';
const serverUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${API_TOKEN}`;
const WEATHER_CACHE_EXPIRATION_TIME = 60 * 60000; // 60 minutes

const url = buildUrl.bind(null, serverUrl);
const weatherCache = new Map();

async function getByCityId(cityId) {
    return new Promise((resolve, reject) => {
        if (weatherCache.has(cityId)) {
            const weatherObj = weatherCache.get(cityId);
            if (Date.now() - weatherObj.lastModified <= WEATHER_CACHE_EXPIRATION_TIME) {
                resolve(weatherObj.weatherData);
            }
        }

        fetch(url(`id=${cityId}`))
            .then(res => res.text())
            .then(weatherData => {
                weatherCache.set(cityId, {weatherData, lastModified: Date.now()});
                resolve(weatherData);
            })
            .catch(err => reject(err));
    })
}

module.exports = {getByCityId};
