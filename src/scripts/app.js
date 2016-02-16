import "underscore";

import MapPanel from "./MapPanel.js";
import TimePanel from "./TimePanel.js";
import TogglePanel from "./TogglePanel.js";
import CrimePieChart from "./CrimePieChart.js";
import constants from "./constants.js";
import hub from "./datahub.js";

function afterLoad() {
    L.mapbox.accessToken = "pk.eyJ1IjoibXJtYWdtYSIsImEiOiJjaWs3ZmI3YWYwMWZjcGlrc25uenkxeWoyIn0.dRTC3GgeeJLxvh5RrzBogw";
    
    var cYear = (new Date()).getFullYear();
    
    hub.initData("date_filter", {
        min: new Date(`Jan ${cYear}`),
        max: new Date(`Dec 31 ${cYear}`)
    });
    let typeFilter = {};
    for (let type of constants.crimeTypes) {
        typeFilter[type] = true;
    }
    hub.initData("type_filter", typeFilter);
    
    new TimePanel({
        el: "time-controls",
        year: {
            min: "2016",
            max: "2016"
        },
        month: {
            min: "Jan",
            max: "Dec"
        }
    });
    
    new TogglePanel({
        el: "crime-toggles",
        types: constants.crimeTypes
    });
    
    new CrimePieChart({
        el: "crime-breakdown-chart"
    });
    
    new MapPanel({
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
        clearInterval(interval);
        afterLoad();
    }
}, 10);
