"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var d3 = require("d3");
var _ = require("underscore");

var LoadingOverlay = require("./LoadingOverlay.js");
var CrimeMap = require("./CrimeMap.js");
var crimedata = require("./crimedata.js");
var mapsutil = require("./mapsutil.js");

var MapPanel = function () {
    function MapPanel() {
        var cfg = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, MapPanel);

        var _cfg$lat = cfg.lat;
        var lat = _cfg$lat === undefined ? 10 : _cfg$lat;
        var _cfg$lng = cfg.lng;
        var lng = _cfg$lng === undefined ? 10 : _cfg$lng;
        var _cfg$zoom = cfg.zoom;
        var zoom = _cfg$zoom === undefined ? 11 : _cfg$zoom;
        var el = cfg.el;
        var _cfg$bounds = cfg.bounds;
        var bounds = _cfg$bounds === undefined ? {
            min: new google.maps.LatLng(-Infinity, -Infinity),
            max: new google.maps.LatLng(Infinity, Infinity),
            zoom: [10, 21]
        } : _cfg$bounds;

        this.el = d3.select(el);
        this.map = new google.maps.Map(this.el.append("div").attr("class", "map-container").node(), {
            center: { lat: lat, lng: lng },
            zoom: zoom,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        this.spinner = new LoadingOverlay(this.el.node());
        this.crimeMap = new CrimeMap(this.el.node());

        mapsutil.boundMapPos(this.map, new google.maps.LatLngBounds(bounds.min, bounds.max));

        mapsutil.boundMapZoom(this.map, bounds.zoom);

        this.loadData();
    }

    _createClass(MapPanel, [{
        key: "loadData",
        value: function loadData() {
            var _this = this;

            var year = new Date().getFullYear();
            if (!crimedata.hasYearLoaded(year)) {
                (function () {
                    if (!crimedata.isYearRequested(year)) {
                        crimedata.loadYear(year);
                    }
                    // If our data is taking more than 1/2 second to load let people
                    // know that we're actually doing something
                    var spinTimer = setTimeout(_this.spinner.show.bind(_this.spinner), 500);
                    crimedata.onYearLoad(year, function () {
                        clearTimeout(spinTimer);
                        _this.spinner.hide();
                        _this.displayData();
                    });
                })();
            } else {
                this.displayData();
            }
        }
    }, {
        key: "displayData",
        value: function displayData() {
            this.crimeMap.add(crimedata.all());
            new google.maps.visualization.HeatmapLayer({
                map: this.map,
                data: crimedata.all().map(function (crime) {
                    return new google.maps.LatLng(crime.latitude, crime.longitude);
                })
            });
        }
    }]);

    return MapPanel;
}();

module.exports = MapPanel;