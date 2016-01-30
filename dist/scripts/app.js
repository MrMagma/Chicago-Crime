"use strict";

var d3 = require("d3");
var _ = require("underscore");

var MapPanel = require("./MapPanel.js");

var map = new MapPanel({
    el: "#map",
    lat: 41.8339037,
    lng: -87.872238,
    bounds: {
        min: new google.maps.LatLng(41.5, -88),
        max: new google.maps.LatLng(42, -87.5),
        zoom: [10, 21]
    }
});