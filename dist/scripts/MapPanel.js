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

function sortDateRange(_ref) {
    var min = _ref.min;
    var max = _ref.max;

    min = min.getTime();
    max = max.getTime();
    return {
        min: new Date(Math.min(min, max)),
        max: new Date(Math.max(min, max))
    };
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
        var range = cfg.range;


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

        _this.addChild(_this.spinner);
        _this.on("change", _this.handleChange.bind(_this));
        _this.initData("date_filter", range);
        var typeFilter = {};
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = _constants2.default.crimeTypes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var type = _step.value;

                typeFilter[type] = true;
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

        _this.initData("type_filter", typeFilter);

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
            // TODO (Joshua): This is not the most performant thing to do and
            // should be fixed in the future, but for now it'll work fine.
            this.clusterer.clearLayers();
            var dateFilter = sortDateRange(this.getData("date_filter"));
            var typeFilter = this.getData("type_filter");
            console.log(dateFilter);
            var crimes = _crimedata2.default.all({
                where: function where(crime) {
                    var epoch = crime.date.getTime();
                    return epoch >= dateFilter.min && epoch <= dateFilter.max;
                }
            });

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = crimes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var crime = _step2.value;

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
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            this.map.addLayer(this.clusterer);
        }
    }, {
        key: "handleChange",
        value: function handleChange() {
            // this.displayData();
        }
    }]);

    return MapPanel;
}(_Component3.default);

exports.default = MapPanel;