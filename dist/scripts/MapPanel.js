"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _tinycolor = require("tinycolor2");

var _tinycolor2 = _interopRequireDefault(_tinycolor);

var _Component2 = require("./Component.js");

var _Component3 = _interopRequireDefault(_Component2);

var _LoadingOverlay = require("./LoadingOverlay.js");

var _LoadingOverlay2 = _interopRequireDefault(_LoadingOverlay);

var _crimedata = require("./crimedata.js");

var _crimedata2 = _interopRequireDefault(_crimedata);

var _constants = require("./constants.js");

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function iconCreator(cluster) {
    var _cluster$getAllChildM = cluster.getAllChildMarkers().map(function (marker) {
        return _constants2.default.colors[marker.options.crimeType];
    }).reduce(function (pVal, cVal, i) {
        return {
            stroke: (pVal.stroke + cVal.stroke) / 2,
            fill: (pVal.fill + cVal.fill) / 2
        };
    });

    var stroke = _cluster$getAllChildM.stroke;
    var fill = _cluster$getAllChildM.fill;


    fill = (0, _tinycolor2.default)(Math.round(fill).toString(16)).toHexString();
    stroke = (0, _tinycolor2.default)(fill);
    if (stroke.isDark()) {
        stroke.brighten(35).toHexString();
    } else {
        stroke.desaturate(35).toHexString();
    }

    var sz = 24 * (1 + cluster.getChildCount() / 200);

    var icon = L.divIcon({
        className: "crime-icon",
        iconSize: new L.Point(sz, sz),
        html: "<div class=\"crime-icon-inner\" style=\"\n            background-color: " + fill + ";\n            border: 0.2em solid " + stroke + ";\"></div>"
    });

    return icon;
}

var MapPanel = function (_Component) {
    _inherits(MapPanel, _Component);

    function MapPanel() {
        var cfg = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, MapPanel);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MapPanel).call(this, cfg));

        var _cfg$lat = cfg.lat;
        var lat = _cfg$lat === undefined ? 10 : _cfg$lat;
        var _cfg$lng = cfg.lng;
        var lng = _cfg$lng === undefined ? 10 : _cfg$lng;
        var _cfg$zoom = cfg.zoom;
        var zoom = _cfg$zoom === undefined ? 11 : _cfg$zoom;
        var _cfg$el = cfg.el;
        var el = _cfg$el === undefined ? "map" : _cfg$el;
        var _cfg$bounds = cfg.bounds;
        var bounds = _cfg$bounds === undefined ? {
            southWest: L.latLng(-Infinity, -Infinity),
            northEast: L.latLng(Infinity, Infinity),
            zoom: {
                min: 10,
                max: 21
            }
        } : _cfg$bounds;


        _this.domNode = document.getElementById(el);
        _this.map = L.mapbox.map(_this.domNode, "mapbox.streets", {
            maxBounds: L.latLngBounds(bounds.southWest, bounds.northEast),
            maxZoom: bounds.zoom.max,
            minZoom: bounds.zoom.min
        }).setView([lat, lng], zoom);

        _this.clusterer = new L.MarkerClusterGroup({
            polygonOptions: {
                fillColor: "rgba(0, 0, 0, 0)",
                color: "rgba(0, 0, 0, 0)"
            },
            iconCreateFunction: iconCreator,
            maxClusterRadius: 30
        });

        _this.spinner = new _LoadingOverlay2.default({
            message: "Fetching data. Please wait..."
        });

        _this.appendChild(_this.spinner);

        _this.loadData();
        return _this;
    }

    _createClass(MapPanel, [{
        key: "loadData",
        value: function loadData() {
            var _this2 = this;

            var year = new Date().getFullYear();
            if (!_crimedata2.default.hasYearLoaded(year)) {
                (function () {
                    if (!_crimedata2.default.isYearRequested(year)) {
                        _crimedata2.default.loadYear(year);
                    }
                    // If our data is taking more than 1/2 second to load let people
                    // know that we're actually doing something
                    var spinTimer = setTimeout(_this2.spinner.show.bind(_this2.spinner), 500);
                    _crimedata2.default.onYearLoad(year, function () {
                        clearTimeout(spinTimer);
                        _this2.spinner.hide();
                        _this2.displayData();
                    });
                })();
            } else {
                this.displayData();
            }
        }
    }, {
        key: "displayData",
        value: function displayData() {
            var crimes = _crimedata2.default.all();

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = crimes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var crime = _step.value;

                    this.clusterer.addLayer(new L.Marker(L.latLng(crime.latitude, crime.longitude), {
                        icon: L.divIcon({
                            className: _constants2.default.css.classPrefix + "-" + crime.primary_type.replace(" ", "_") + " crime-icon",
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
}(_Component3.default);

exports.default = MapPanel;