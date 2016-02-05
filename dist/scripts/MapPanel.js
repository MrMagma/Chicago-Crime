"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = require("underscore");
var tinycolor = require("tinycolor2");

var LoadingOverlay = require("./LoadingOverlay.js");
var crimedata = require("./crimedata.js");
var constants = require("./constants.js");

function iconCreator(cluster) {
    var _cluster$getAllChildM = cluster.getAllChildMarkers().map(function (marker) {
        return constants.colors[marker.options.crimeType];
    }).reduce(function (pVal, cVal, i) {
        return {
            stroke: (pVal.stroke + cVal.stroke) / 2,
            fill: (pVal.fill + cVal.fill) / 2
        };
    });

    var stroke = _cluster$getAllChildM.stroke;
    var fill = _cluster$getAllChildM.fill;

    fill = tinycolor(Math.round(fill).toString(16)).toHexString();
    stroke = tinycolor(fill);
    if (stroke.isDark()) {
        stroke.brighten(35);
    } else {
        stroke.desaturate(35);
    }

    var sz = 24 * (1 + cluster.getChildCount() / 200);

    var icon = L.divIcon({
        className: "crime-icon",
        iconSize: new L.Point(sz, sz),
        html: "<div class=\"crime-icon-inner\" style=\"\n            background-color: " + fill + ";\n            border: 0.2em solid " + stroke + ";\"></div>"
    });

    return icon;
}

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
            southWest: L.latLng(-Infinity, -Infinity),
            northEast: L.latLng(Infinity, Infinity),
            zoom: {
                min: 10,
                max: 21
            }
        } : _cfg$bounds;

        this.el = document.getElementById(el);
        this.map = L.mapbox.map("map", "mapbox.streets", {
            maxBounds: L.latLngBounds(bounds.southWest, bounds.northEast),
            maxZoom: bounds.zoom.max,
            minZoom: bounds.zoom.min
        }).setView([lat, lng], zoom);

        this.clusterer = new L.MarkerClusterGroup({
            polygonOptions: {
                fillColor: "rgba(0, 0, 0, 0)",
                color: "rgba(0, 0, 0, 0)"
            },
            iconCreateFunction: iconCreator,
            maxClusterRadius: 30
        });
        this.spinner = new LoadingOverlay(this.el);

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
            var crimes = crimedata.all();

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = crimes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var crime = _step.value;

                    this.clusterer.addLayer(new L.Marker(L.latLng(crime.latitude, crime.longitude), {
                        icon: L.divIcon({
                            className: constants.css.classPrefix + "-" + crime.primary_type.replace(" ", "_") + " crime-icon",
                            iconSize: new L.Point(18, 18)
                        }),
                        title: "Crime doesn't pay",
                        crimeType: crime.primary_type
                    }));
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            this.map.addLayer(this.clusterer);
        }
    }]);

    return MapPanel;
}();

module.exports = MapPanel;