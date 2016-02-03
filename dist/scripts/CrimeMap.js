"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var d3 = require("d3");
var _ = require("underscore");

var Crime = require("./Crime.js");
var constants = require("./constants.js");

var CrimeMap = function () {
    function CrimeMap(el) {
        _classCallCheck(this, CrimeMap);

        var w = Math.abs(constants.map.lng.max - constants.map.lng.min),
            h = Math.abs(constants.map.lat.max - constants.map.lat.min);
        console.log(w, h);
        this.svg = d3.select(el).append("svg").attr("class", "map-overlay").attr("viewBox", "0 0 " + w + " " + h).attr("width", 1).attr("height", 1).append("g").attr("transform", "scale(" + w + ", " + -h + ") translate(" + -constants.map.lng.min + ", " + (-constants.map.lat.min - h * 1.5) + ")");
        this.crimes = [];
    }

    _createClass(CrimeMap, [{
        key: "add",
        value: function add(data) {
            if (!_.isArray(data)) {
                data = [data];
            }

            var svgNode = this.svg.node();

            data = data.filter(function (crime) {
                return _.isObject(crime);
            }).map(function (crimeData) {
                return new Crime(svgNode, crimeData);
            });

            this.crimes.push.apply(this.crimes, data);
        }
    }, {
        key: "hide",
        value: function hide() {
            var where = arguments.length <= 0 || arguments[0] === undefined ? function () {
                return true;
            } : arguments[0];
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.crimes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var crime = _step.value;

                    if (where(crime)) {
                        crime.hide();
                    }
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
        }
    }, {
        key: "show",
        value: function show() {
            var where = arguments.length <= 0 || arguments[0] === undefined ? function () {
                return true;
            } : arguments[0];
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.crimes[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var crime = _step2.value;

                    if (where(crime)) {
                        crime.hide();
                    }
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
        }
    }]);

    return CrimeMap;
}();

module.exports = CrimeMap;