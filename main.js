'use strict';

import Icons from "./leaflet-color-icons.js";
import {loadLocalFile, caseInsensitiveCompare} from "./utils.js";
import {getByCityId as getWeatherByCityId} from "./weather.js";

const CITY_ZOOM = 10;
const WEATHER_CACHE_EXPIRATION_TIME = 60 * 60000; // 60 minutes
const DEFAULT_CITY_MARKER_ICON = Icons.blueIcon;

const citiesCache = new Map();
const weatherCache = new Map();
const markersCache = new Map();

const map = initMap('map-section');
const citiesListElement = document.querySelector('#cities-list');

let selectedCity;

loadLocalFile('cities.json')
    .then(data => {
        const cities = JSON.parse(data).sort(
            (c1, c2) => caseInsensitiveCompare(c1.name, c2.name)
        );
        renderCities(cities);
    })
    .catch(err => console.error(err));

function renderCities(cities) {
    if (!cities || cities.length === 0) {
        return;
    }

    const citiesFragment = document.createDocumentFragment();
    cities.forEach(city => {
        addCityMarker(city);
        citiesFragment.appendChild(createCityElement(city));
    });

    citiesListElement.removeChildren();
    citiesListElement.appendChild(citiesFragment);
    citiesListElement.selectedIndex = -1;
    citiesListElement.onchange = cityChanged;
}

function cityChanged(e) {
    if (selectedCity) {
        markersCache.get(selectedCity).setIcon(Icons.blueIcon);
    }
    selectedCity = citiesCache.get(Number(e.target.value));
    markersCache.get(selectedCity).setIcon(Icons.redIcon);
    map.flyTo([selectedCity.coord.lat, selectedCity.coord.lon], CITY_ZOOM);
    updateWeatherInfo();
}

function updateWeatherInfo(city = selectedCity) {
    if (weatherCache.has(city)) {
        const weatherData = weatherCache.get(city);
        if (Date.now() - weatherData.lastModified <= WEATHER_CACHE_EXPIRATION_TIME) {
            renderWeatherData(weatherData);
            return;
        }
    }

    getWeatherByCityId(city.id)
        .then(weatherData => {
            weatherData.lastModified = Date.now();
            weatherCache.set(city, weatherData);
            renderWeatherData(weatherData);
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

function initMap(mapElementId) {
    const map = L.map(mapElementId);
    map.setView({lon: 0, lat: 0}, 1);
    L.tileLayer('https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=f5LbbrtwrAG63SgNdh3Q', {
        attribution: `<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a>
    <a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>`,
    }).addTo(map);

    map.fitWorld().zoomIn();

    map.on('resize', function () {
        map.fitWorld({reset: true}).zoomIn();
    });
    return map;
}

function addCityMarker(city, icon = DEFAULT_CITY_MARKER_ICON) {
    const marker = new L.marker([city.coord.lat, city.coord.lon], {title: city.name, icon: icon});
    marker.addTo(map);
    markersCache.set(city, marker);
}

function createCityElement(city) {
    const cityElement = document.createElement('option');
    cityElement.innerHTML = city.name;
    cityElement.value = city.id;
    citiesCache.set(city.id, city);
    return cityElement;
}
