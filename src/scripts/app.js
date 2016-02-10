import "underscore";

import MapPanel from "./MapPanel.js";
import FancySelect from "./FancySelect.js";
import constants from "./constants.js";

function afterLoad() {
    L.mapbox.accessToken = "pk.eyJ1IjoibXJtYWdtYSIsImEiOiJjaWs3ZmI3YWYwMWZjcGlrc25uenkxeWoyIn0.dRTC3GgeeJLxvh5RrzBogw";
    var map = new MapPanel({
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
    
    new FancySelect({
        el: "month-min-select",
        values: constants.months
    });
    
    new FancySelect({
        el: "month-max-select",
        values: constants.months
    });
    
    new FancySelect({
        el: "year-min-select",
        values: constants.years
    });
    
    new FancySelect({
        el: "year-max-select",
        values: constants.years
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
