"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var d3 = require("d3");
var _ = require("underscore");

var JSONRequest = require("./JSONRequest.js");
var mapsutil = require("./mapsutil.js");

var MapPanel = function MapPanel() {
    var cfg = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, MapPanel);

    var _cfg$lat = cfg.lat;
    var lat = _cfg$lat === undefined ? 10 : _cfg$lat;
    var _cfg$lng = cfg.lng;
    var lng = _cfg$lng === undefined ? 10 : _cfg$lng;
    var _cfg$zoom = cfg.zoom;
    var zoom = _cfg$zoom === undefined ? 11 : _cfg$zoom;
    var el = cfg.el;

    this.el = d3.select(el);
    this.map = new google.maps.Map(this.el.node(), {
        center: { lat: lat, lng: lng },
        zoom: zoom,
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    mapsutil.boundMapPos(this.map, new google.maps.LatLngBounds(new google.maps.LatLng(41.5, -88), new google.maps.LatLng(42, -87.5)));

    mapsutil.boundMapZoom(this.map, [10, 21]);
};

module.exports = MapPanel;