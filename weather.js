'use strict';

import {buildUrl} from "./utils.js";

const API_TOKEN = '5d96fcae82ff1063cf7e1c1f78882d73';
const serverUrl = `https://api.openweathermap.org/data/2.5/weather?appid=${API_TOKEN}`;
const url = buildUrl.bind(null, serverUrl);

async function getByCityId(cityId) {
    const data = await fetch(url(`id=${cityId}`)).catch(err => err);
    return data.json();
}

export {getByCityId};
