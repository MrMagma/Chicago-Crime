var d3 = require("d3");
var _ = require("underscore");
var constants = require("./constants.js");

var MapPanel = require("./MapPanel.js");

function afterLoad() {
    var map = new MapPanel({
        el: "#map",
        lat: (constants.map.lat.min + constants.map.lat.max) / 2,
        lng: (constants.map.lng.min + constants.map.lng.max) / 2,
        zoom: 10,
        bounds: {
            min: new google.maps.LatLng(constants.map.lat.min,
                constants.map.lng.min),
            max: new google.maps.LatLng(constants.map.lat.max,
                constants.map.lng.max),
            zoom: [constants.map.zoom.min, constants.map.zoom.max]
        }
    });
}

var interval = setInterval(function() {
    if (document.readyState === "complete") {
        afterLoad();
        clearInterval(interval);
    }
}, 10);
