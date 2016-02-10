"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Component2 = require("./Component.js");

var _Component3 = _interopRequireDefault(_Component2);

var _FancySelect = require("./FancySelect.js");

var _FancySelect2 = _interopRequireDefault(_FancySelect);

var _constants = require("./constants.js");

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TimePanel = function (_Component) {
    _inherits(TimePanel, _Component);

    function TimePanel() {
        var cfg = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, TimePanel);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TimePanel).call(this, cfg));

        var el = cfg.el;
        var year = cfg.year;
        var month = cfg.month;


        _this.domNode = document.getElementById(el);

        new _FancySelect2.default({
            el: "year-min-select",
            start: new Date().getFullYear(),
            values: _constants2.default.years,
            listeners: {
                change: function change(_ref) {
                    var val = _ref.val;

                    _this.setData("year", {
                        min: val,
                        max: _this.getData("year").max
                    });
                }
            }
        });
        new _FancySelect2.default({
            el: "year-max-select",
            start: new Date().getFullYear(),
            values: _constants2.default.years,
            listeners: {
                change: function change(_ref2) {
                    var val = _ref2.val;

                    _this.setData("year", {
                        min: _this.getData("year").min,
                        max: val
                    });
                }
            }
        });
        new _FancySelect2.default({
            el: "month-min-select",
            start: "Jan",
            values: _constants2.default.months,
            listeners: {
                change: function change(_ref3) {
                    var val = _ref3.val;

                    _this.setData("month", {
                        min: val,
                        max: _this.getData("month").max
                    });
                }
            }
        });
        new _FancySelect2.default({
            el: "month-max-select",
            start: "Dec",
            values: _constants2.default.months,
            listeners: {
                change: function change(_ref4) {
                    var val = _ref4.val;

                    _this.setData("month", {
                        min: _this.getData("month").min,
                        max: val
                    });
                }
            }
        });

        _this.setData("month", month);
        _this.setData("year", year);
        return _this;
    }

    return TimePanel;
}(_Component3.default);

exports.default = TimePanel;