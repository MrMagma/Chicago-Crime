"use strict";

require("underscore");

var _MapPanel = require("./MapPanel.js");

var _MapPanel2 = _interopRequireDefault(_MapPanel);

var _TimePanel = require("./TimePanel.js");

var _TimePanel2 = _interopRequireDefault(_TimePanel);

var _TogglePanel = require("./TogglePanel.js");

var _TogglePanel2 = _interopRequireDefault(_TogglePanel);

var _CrimePieChart = require("./CrimePieChart.js");

var _CrimePieChart2 = _interopRequireDefault(_CrimePieChart);

var _constants = require("./constants.js");

var _constants2 = _interopRequireDefault(_constants);

var _datahub = require("./datahub.js");

var _datahub2 = _interopRequireDefault(_datahub);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function afterLoad() {
    L.mapbox.accessToken = "pk.eyJ1IjoibXJtYWdtYSIsImEiOiJjaWs3ZmI3YWYwMWZjcGlrc25uenkxeWoyIn0.dRTC3GgeeJLxvh5RrzBogw";

    var cYear = new Date().getFullYear();

    _datahub2.default.initData("date_filter", {
        min: new Date("Jan " + cYear),
        max: new Date("Dec 31 " + cYear)
    });
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

    _datahub2.default.initData("type_filter", typeFilter);

    new _TimePanel2.default({
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

    new _TogglePanel2.default({
        el: "crime-toggles",
        types: _constants2.default.crimeTypes
    });

    new _CrimePieChart2.default({
        el: "crime-breakdown-chart"
    });

    new _MapPanel2.default({
        lat: (_constants2.default.map.southWest.lat + _constants2.default.map.northEast.lat) / 2,
        lng: (_constants2.default.map.southWest.lng + _constants2.default.map.northEast.lng) / 2,
        zoom: 10,
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
        clearInterval(interval);
        afterLoad();
    }
}, 10);