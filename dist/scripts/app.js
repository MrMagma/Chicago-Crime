"use strict";

var d3 = require("d3");
var _ = require("underscore");
var mapsutil = require("./mapsutil.js");

var map = new google.maps.Map(d3.select("#map").node(), {
    center: { lat: 41.8339037, lng: -87.872238 },
    zoom: 11,
    disableDefaultUI: true,
    mapTypeId: google.maps.MapTypeId.ROADMAP
});

mapsutil.boundMapPos(map, new google.maps.LatLngBounds(new google.maps.LatLng(41.5, -88), new google.maps.LatLng(42, -87.5)));

mapsutil.boundMapZoom(map, [10, 21]);