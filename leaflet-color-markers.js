'use strict';

const iconsUrl = 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img';
const shadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png';

export const blueIcon = new L.Icon({
	iconUrl: `${iconsUrl}/marker-icon-2x-blue.png`,
	shadowUrl: shadowUrl,
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

export const redIcon = new L.Icon({
	iconUrl: `${iconsUrl}/marker-icon-2x-red.png`,
	shadowUrl: shadowUrl,
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
	shadowSize: [41, 41]
});

// export const greenIcon = new L.Icon({
// 	iconUrl: `${iconsUrl}/marker-icon-2x-green.png`,
// 	shadowUrl: shadowUrl,
// 	iconSize: [25, 41],
// 	iconAnchor: [12, 41],
// 	popupAnchor: [1, -34],
// 	shadowSize: [41, 41]
// });
//
// export const orangeIcon = new L.Icon({
// 	iconUrl: `${iconsUrl}/marker-icon-2x-orange.png`,
// 	shadowUrl: shadowUrl,
// 	iconSize: [25, 41],
// 	iconAnchor: [12, 41],
// 	popupAnchor: [1, -34],
// 	shadowSize: [41, 41]
// });
//
// export const yellowIcon = new L.Icon({
// 	iconUrl: `${iconsUrl}/marker-icon-2x-yellow.png`,
// 	shadowUrl: shadowUrl,
// 	iconSize: [25, 41],
// 	iconAnchor: [12, 41],
// 	popupAnchor: [1, -34],
// 	shadowSize: [41, 41]
// });
//
// export const vioconstIcon = new L.Icon({
// 	iconUrl: `${iconsUrl}/marker-icon-2x-vioconst.png`,
// 	shadowUrl: shadowUrl,
// 	iconSize: [25, 41],
// 	iconAnchor: [12, 41],
// 	popupAnchor: [1, -34],
// 	shadowSize: [41, 41]
// });
//
// export const greyIcon = new L.Icon({
// 	iconUrl: `${iconsUrl}/marker-icon-2x-grey.png`,
// 	shadowUrl: shadowUrl,
// 	iconSize: [25, 41],
// 	iconAnchor: [12, 41],
// 	popupAnchor: [1, -34],
// 	shadowSize: [41, 41]
// });
//
// export const blackIcon = new L.Icon({
// 	iconUrl: `${iconsUrl}/marker-icon-2x-black.png`,
// 	shadowUrl: shadowUrl,
// 	iconSize: [25, 41],
// 	iconAnchor: [12, 41],
// 	popupAnchor: [1, -34],
// 	shadowSize: [41, 41]
// });
