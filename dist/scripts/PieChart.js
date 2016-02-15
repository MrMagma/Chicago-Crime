"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PieChart = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component3 = require("./Component.js");

var _Component4 = _interopRequireDefault(_Component3);

var _tinycolor = require("tinycolor2");

var _tinycolor2 = _interopRequireDefault(_tinycolor);

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
        return _this;
    }

    _createClass(PieSlice, [{
        key: "update",
        value: function update() {
            var pos1 = polarToCartesian(this.parent.x, this.parent.y, this.parent.radius, this.start),
                pos2 = polarToCartesian(this.parent.x, this.parent.y, this.parent.radius, this.start + this.amt);

            this.arcNode.setAttribute("d", describeArc(this.parent.x, this.parent.y, this.parent.radius, this.start, this.start + this.amt));
            this.arcNode.setAttribute("fill", this.color.toHexString());
            this.triNode.setAttribute("d", "M50 50 L" + pos1.x + " " + pos1.y + " L" + pos2.x + " " + pos2.y);
            this.triNode.setAttribute("fill", this.color.toHexString());
        }
    }]);

    return PieSlice;
}(_Component4.default);

var PieChart = exports.PieChart = function (_Component2) {
    _inherits(PieChart, _Component2);

    function PieChart(dat) {
        _classCallCheck(this, PieChart);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(PieChart).call(this, dat));

        var data = dat.data;
        var el = dat.el;

        _this2.domNode = document.getElementById(el);
        _this2.data = data.map(function (json) {
            return JSON.parse(JSON.stringify(json));
        });
        _this2.x = 50;
        _this2.y = 50;
        _this2.radius = 40;

        _this2.displayData();
        return _this2;
    }

    _createClass(PieChart, [{
        key: "displayData",
        value: function displayData() {
            var start = 0;
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.data[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var dataEl = _step.value;

                    dataEl.parent = this;
                    var amt = dataEl.percent / 100 * 360;
                    this.addChild(new PieSlice(dataEl, start, amt));
                    start += amt;
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
        key: "addData",
        value: function addData(data) {}
    }]);

    return PieChart;
}(_Component4.default);

exports.default = PieChart;