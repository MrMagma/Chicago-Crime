"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.CrimePieChart = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _Component3 = require("./Component.js");

var _Component4 = _interopRequireDefault(_Component3);

var _tinycolor = require("tinycolor2");

var _tinycolor2 = _interopRequireDefault(_tinycolor);

var _datahub = require("./datahub.js");

var _datahub2 = _interopRequireDefault(_datahub);

var _crimedata = require("./crimedata.js");

var _crimedata2 = _interopRequireDefault(_crimedata);

var _filtercrimes2 = require("./util/filtercrimes.js");

var _filtercrimes3 = _interopRequireDefault(_filtercrimes2);

var _constants = require("./constants.js");

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* Taken from StackOverflow: http://stackoverflow.com/a/18473154 */
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;

    return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians)
    };
}

function describeArc(x, y, radius, startAngle, endAngle) {
    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";

    var d = ["M", start.x, start.y, "A", radius, radius, 0, arcSweep, 0, end.x, end.y].join(" ");

    return d;
}

var SVGNS = "http://www.w3.org/2000/svg";

var PieSlice = function (_Component) {
    _inherits(PieSlice, _Component);

    function PieSlice(data, start, amt) {
        _classCallCheck(this, PieSlice);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(PieSlice).call(this, data));

        var _data$color = data.color;
        var color = _data$color === undefined ? 0xCCCCCC : _data$color;

        _this.domNode = document.createElementNS(SVGNS, "g");
        _this.arcNode = document.createElementNS(SVGNS, "path");
        _this.triNode = document.createElementNS(SVGNS, "path");
        _this.start = start;
        _this.amt = amt;
        _this.color = (0, _tinycolor2.default)(color.toString(16));

        _this.domNode.appendChild(_this.arcNode);
        _this.domNode.appendChild(_this.triNode);

        _this.update();
        _this.parent.addChild(_this);
        return _this;
    }

    _createClass(PieSlice, [{
        key: "update",
        value: function update() {
            var pos1 = polarToCartesian(this.parent.x, this.parent.y, this.parent.radius, this.start),
                pos2 = polarToCartesian(this.parent.x, this.parent.y, this.parent.radius, this.start + this.amt);

            this.arcNode.setAttribute("d", describeArc(this.parent.x, this.parent.y, this.parent.radius, this.start, this.start + this.amt));
            this.arcNode.setAttribute("fill", this.color.toHexString());
            this.arcNode.setAttribute("stroke-width", 1);
            this.arcNode.setAttribute("stroke", this.color.toHexString());
            this.triNode.setAttribute("d", "M50 50 L" + pos1.x + " " + pos1.y + " L" + pos2.x + " " + pos2.y);
            this.triNode.setAttribute("fill", this.color.toHexString());
            this.triNode.setAttribute("stroke-width", 1);
            this.triNode.setAttribute("stroke", this.color.toHexString());
        }
    }, {
        key: "setDisplay",
        value: function setDisplay(_ref) {
            var _ref$start = _ref.start;
            var start = _ref$start === undefined ? this.start : _ref$start;
            var _ref$amt = _ref.amt;
            var amt = _ref$amt === undefined ? this.amt : _ref$amt;

            this.start = start;
            this.amt = amt;
        }
    }]);

    return PieSlice;
}(_Component4.default);

var CrimePieChart = exports.CrimePieChart = function (_Component2) {
    _inherits(CrimePieChart, _Component2);

    function CrimePieChart(data) {
        _classCallCheck(this, CrimePieChart);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(CrimePieChart).call(this, data));

        var el = data.el;

        _this2.domNode = document.getElementById(el);
        _this2.x = 50;
        _this2.y = 50;
        _this2.radius = 40;
        _this2.slices = [];

        var year = new Date().getFullYear();
        if (!_crimedata2.default.hasYearLoaded(year)) {
            _crimedata2.default.onYearLoad(year, _this2.initData.bind(_this2));
        }

        _datahub2.default.on("data_loaded", _this2.displayData.bind(_this2));
        return _this2;
    }

    _createClass(CrimePieChart, [{
        key: "getCrimeCounts",
        value: function getCrimeCounts() {
            var counts = Array.apply(null, Array(_constants2.default.crimeTypes.length)).map(function () {
                return 0;
            });

            var _filtercrimes = (0, _filtercrimes3.default)();

            var crimes = _filtercrimes.crimes;
            var allLoaded = _filtercrimes.allLoaded;

            var total = 0;

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = crimes[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var _step$value = _step.value;
                    var crime = _step$value.crime;
                    var show = _step$value.show;

                    if (show) {
                        total += 1;
                        counts[_constants2.default.crimeIds[_constants2.default.typeMap[crime.primary_type]]] += 1;
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

            return {
                counts: counts,
                total: total
            };
        }
    }, {
        key: "initData",
        value: function initData() {
            var _this3 = this;

            var _getCrimeCounts = this.getCrimeCounts();

            var counts = _getCrimeCounts.counts;
            var total = _getCrimeCounts.total;

            var start = 0;

            var slices = counts.map(function (val, i) {
                var amt = val / total * 360;

                var n = new PieSlice({
                    parent: _this3,
                    color: _constants2.default.colors[_constants2.default.crimeTypes[i]].fill
                }, start, amt);
                start += amt;
                return n;
            });

            this.displayData();
        }
    }, {
        key: "displayData",
        value: function displayData() {
            var _getCrimeCounts2 = this.getCrimeCounts();

            var counts = _getCrimeCounts2.counts;
            var total = _getCrimeCounts2.total;


            var start = 0;

            for (var i = 0; i < this.slices.length; i++) {
                var amt = counts[i] / total * 360;
                this.slices[i].setDisplay({
                    start: start,
                    amt: amt
                });
                start += amt;
            }
        }
    }]);

    return CrimePieChart;
}(_Component4.default);

exports.default = CrimePieChart;