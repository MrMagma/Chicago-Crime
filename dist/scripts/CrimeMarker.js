"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _constants = require("./constants.js");

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var crimes = {};

var CrimeMarker = function () {
    function CrimeMarker(crime, clusterer) {
        _classCallCheck(this, CrimeMarker);

        this.crime = crime;
        this.marker = new L.Marker(L.latLng(crime.latitude, crime.longitude), {
            icon: L.divIcon({
                className: _constants2.default.css.classPrefix + "-" + crime.primary_type.replace(" ", "_") + " crime-icon",
                iconSize: new L.Point(18, 18)
            }),
            title: "Crime doesn't pay",
            crimeType: crime.primary_type
        });
        this.clusterer = clusterer;
        this.shown = false;
        this.id = crime.id;

        this.show();
    }

    _createClass(CrimeMarker, [{
        key: "show",
        value: function show() {
            if (!this.shown) {
                this.clusterer.addLayer(this.marker);
                this.shown = true;
            }
        }
    }, {
        key: "hide",
        value: function hide() {
            if (this.shown) {
                this.clusterer.removeLayer(this.marker);
                this.shown = false;
            }
        }
    }], [{
        key: "getMarkerForCrime",
        value: function getMarkerForCrime(crime, clusterer) {
            var id = crime.id;

            if (!crimes.hasOwnProperty(id)) {
                crimes[id] = new CrimeMarker(crime, clusterer);
            }
            return crimes[id];
        }
    }]);

    return CrimeMarker;
}();

exports.default = CrimeMarker;