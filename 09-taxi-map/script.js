// L is an object representing `Leaflet`
// It's available when we include in `leafet.js`
// .map function creates a map object
// the first argument is the ID of the element to contain the map
const mapObject = L.map("mapContainer");

// set the center point of where the map is looking at

// first argument is the lat lng of the center pooint. lat,lng will be stored as array. index 0 is lat and index is lng (but sometimes its reversed)
// second arugment will be the zoom level
mapObject.setView([1.3521, 103.8198], 12);

// the tile layer influences how the map will look like
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mapObject);

// A layer group is a group of layers
// It allows us to put layers into a group so that
// it is easier to manage. And some layer group has 
// special features like the marker cluster group
const markerClusterLayer = L.markerClusterGroup();
markerClusterLayer.addTo(mapObject);

async function loadTaxi() {
    const response = await axios.get("https://api.data.gov.sg/v1/transport/taxi-availability");
    return response.data.features[0].geometry.coordinates;
}

async function renderTaxiMarkers(taxiData) {
    markerClusterLayer.clearLayers();
    for (let taxi of taxiData) {
        const lat = taxi[1];
        const lng = taxi[0];
        const latLng = [lat, lng];
        const taxiMarker = L.marker(latLng);
        taxiMarker.addTo(markerClusterLayer);
    }

}

document.addEventListener("DOMContentLoaded", async function(){
    const taxiData = await loadTaxi();
    renderTaxiMarkers(taxiData);

    setInterval(async function(){
        const taxiData = await loadTaxi();
        renderTaxiMarkers(taxiData);
    }, 60000);
})