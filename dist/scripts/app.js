"use strict";

require("underscore");

var _MapPanel = require("./MapPanel.js");

var _MapPanel2 = _interopRequireDefault(_MapPanel);

var _TimePanel = require("./TimePanel.js");

var _TimePanel2 = _interopRequireDefault(_TimePanel);

var _TogglePanel = require("./TogglePanel.js");

var _TogglePanel2 = _interopRequireDefault(_TogglePanel);

var _constants = require("./constants.js");

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function afterLoad() {
    L.mapbox.accessToken = "pk.eyJ1IjoibXJtYWdtYSIsImEiOiJjaWs3ZmI3YWYwMWZjcGlrc25uenkxeWoyIn0.dRTC3GgeeJLxvh5RrzBogw";

    var cYear = new Date().getFullYear();

    var timePanel, togglePanel, map;

    timePanel = new _TimePanel2.default({
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
            change: function change() {
                var year = timePanel.getData("year");
                var month = timePanel.getData("month");
                map.setData("date_filter", {
                    min: new Date(month.min + " " + year.min),
                    max: new Date(month.max + " " + year.max)
                });
            }
        }
    });

    togglePanel = new _TogglePanel2.default({
        el: "crime-toggles",
        types: _constants2.default.crimeTypes,
        listeners: {
            change: function change() {
                map.setData("type_filter", togglePanel.getData("active"));
            }
        }
    });

    map = new _MapPanel2.default({
        lat: (_constants2.default.map.southWest.lat + _constants2.default.map.northEast.lat) / 2,
        lng: (_constants2.default.map.southWest.lng + _constants2.default.map.northEast.lng) / 2,
        zoom: 10,
        range: {
            min: new Date("Jan " + cYear),
            max: new Date("Dec 31 " + cYear)
        },
        bounds: {
            southWest: _constants2.default.map.southWest,
            northEast: _constants2.default.map.northEast,
            zoom: {
                min: _constants2.default.map.zoom.min,
                max: _constants2.default.map.zoom.max
            }
        }
    });

    var loaders = document.getElementsByClassName("before-script-load");
    for (var i = 0; i < loaders.length; i++) {
        loaders[i].style.opacity = "0";
    }
    setTimeout(function () {
        for (var i = 0; i < loaders.length; i++) {
            loaders[i].style.display = "none";
        }
    });
}

var interval = setInterval(function () {
    if (document.readyState === "complete") {
        afterLoad();
        clearInterval(interval);
    }
}, 10);