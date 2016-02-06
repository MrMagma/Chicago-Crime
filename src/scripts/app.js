var _ = require("underscore");

var MapPanel = require("./MapPanel.js");
var constants = require("./constants.js");

function afterLoad() {
    L.mapbox.accessToken = "pk.eyJ1IjoibXJtYWdtYSIsImEiOiJjaWs3ZmI3YWYwMWZjcGlrc25uenkxeWoyIn0.dRTC3GgeeJLxvh5RrzBogw";
    var map = new MapPanel({
        el: "map",
        lat: (constants.map.southWest.lat + constants.map.northEast.lat) / 2,
        lng: (constants.map.southWest.lng + constants.map.northEast.lng) / 2,
        zoom: 10,
        bounds: {
            southWest: constants.map.southWest,
            northEast: constants.map.northEast,
            zoom: {
                min: constants.map.zoom.min,
                max: constants.map.zoom.max
            }
        }
    });
    
    var loaders = document.getElementsByClassName("before-script-load");
    for (let i = 0; i < loaders.length; i++) {
        loaders[i].style.opacity = "0";
    }
    setTimeout(() => {
        for (let i = 0; i < loaders.length; i++) {
            loaders[i].style.display = "none";
        }
    });
}

var interval = setInterval(function() {
    if (document.readyState === "complete") {
        afterLoad();
        clearInterval(interval);
    }
}, 10);
