import "underscore";

import MapPanel from "./MapPanel.js";
import TimePanel from "./TimePanel.js";
import TogglePanel from "./TogglePanel.js";
import constants from "./constants.js";

function afterLoad() {
    L.mapbox.accessToken = "pk.eyJ1IjoibXJtYWdtYSIsImEiOiJjaWs3ZmI3YWYwMWZjcGlrc25uenkxeWoyIn0.dRTC3GgeeJLxvh5RrzBogw";
    
    var cYear = (new Date()).getFullYear();
    
    var timePanel, togglePanel, map;
    
    timePanel = new TimePanel({
        el: "time-controls",
        year: {
            min: "2016",
            max: "2016"
        },
        month: {
            min: "Jan",
            max: "Dec"
        },
        listeners: {
            change() {
                let year = timePanel.getData("year");
                let month = timePanel.getData("month");
                map.setData("date_filter", {
                    min: new Date(`${month.min} ${year.min}`),
                    max: new Date(`${month.max} ${year.max}`)
                });
            }
        }
    });
    
    togglePanel = new TogglePanel({
        el: "crime-toggles",
        types: constants.crimeTypes,
        listeners: {
            change() {
                map.setData("type_filter", togglePanel.getData("active"));
            }
        }
    });
    
    map = new MapPanel({
        lat: (constants.map.southWest.lat + constants.map.northEast.lat) / 2,
        lng: (constants.map.southWest.lng + constants.map.northEast.lng) / 2,
        zoom: 10,
        range: {
            min: new Date(`Jan ${cYear}`),
            max: new Date(`Dec 31 ${cYear}`)
        },
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
