'use strict';

import {blueIcon, redIcon} from "./leaflet-color-markers.js";
import {loadFile, removeChildren} from "./utils.js";
import * as weather from "./weather.js";

const CITY_ZOOM = 10;
const WEATHER_CACHE_EXPIRATION = 5 * 60000; // 5 minutes
const DEFAULT_MARKER_ICON = blueIcon;

const citiesCache = new Map();
const weatherCache = new Map();
const markers = new Map();

loadFile('cities.json')
    .then(data => {
        const cities = JSON.parse(data).sort((c1, c2) =>
            c1.name.localeCompare(c2.name, undefined, {sensitivity: 'base'})
        );
        renderCities(cities);
    })
    .catch(err => console.error(err));

const map = L.map('map-section');
map.setView({lon: 0, lat: 0}, 1);
L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=f5LbbrtwrAG63SgNdh3Q', {
    attribution: `<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a>
    <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>`,
}).addTo(map);

map.fitWorld().zoomIn();

map.on('resize', function () {
    map.fitWorld({reset: true}).zoomIn();
});

function renderCities(cities) {
    if (!cities || cities.length === 0) {
        return;
    }

    const citiesFragment = document.createDocumentFragment();
    cities.forEach(city => {
        citiesCache.set(city.id, city);
        addMarker(city);

        const cityElement = document.createElement('option');
        cityElement.innerHTML = city.name;
        cityElement.value = city.id;
        citiesFragment.appendChild(cityElement);
    });

    const citiesElement = document.querySelector('#cities-list');
    removeChildren(citiesElement);
    citiesElement.appendChild(citiesFragment);
    citiesElement.onchange = cityChanged;
    citiesElement.selectedIndex = -1;
}

function cityChanged(e) {
    const city = citiesCache.get(Number(e.target.value));
    map.flyTo([city.coord.lat, city.coord.lon], CITY_ZOOM);
    markSelectedCity(city);
    updateWeatherInfo(city);
}

function markSelectedCity(city) {
    resetMarkers();
    map.removeLayer(markers.get(city));
    addMarker(city, redIcon);
}

function resetMarkers() {
    markers.forEach((marker, city) => {
        if (marker.options.icon !== DEFAULT_MARKER_ICON) {
            map.removeLayer(marker);
            addMarker(city);
        }
    });
}

function addMarker(city, icon = DEFAULT_MARKER_ICON) {
    const marker = new L.marker([city.coord.lat, city.coord.lon], {title: city.name, icon: icon});
    marker.addTo(map);
    markers.set(city, marker);
}

function updateWeatherInfo(city) {
    if (weatherCache.has(city.id)) {
        const weatherData = weatherCache.get(city.id);
        if (Date.now() - weatherData.lastModified <= WEATHER_CACHE_EXPIRATION) {
            renderWeatherData(weatherData);
            return;
        }
    }

    weather.getByCityId(city.id)
        .then(data => {
            data.lastModified = Date.now();
            weatherCache.set(city.id, data);
            renderWeatherData(data);
        })
        .catch(err => console.error(err));
}

function renderWeatherData(data) {
    const weatherElem = document.querySelector('#weather-section');
    weatherElem.querySelector('#description').innerHTML = data.weather[0].description;
    weatherElem.querySelector('#wind').innerHTML = `speed ${data.wind.speed}, ${data.wind.deg} degrees`;
    weatherElem.querySelector('#temperature').innerHTML = data.main.temp;
    weatherElem.querySelector('#humidity').innerHTML = `${data.main.humidity}%`;
}
