"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component3 = require("./Component.js");

var _Component4 = _interopRequireDefault(_Component3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FancySelectElement = function (_Component) {
    _inherits(FancySelectElement, _Component);

    function FancySelectElement() {
        var cfg = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, FancySelectElement);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FancySelectElement).call(this, cfg));

        var value = cfg.value;


        _this.domNode = document.createElement("div");
        _this.value = value;

        _this.domNode.style.top = "0%";
        _this.domNode.textContent = _this.value;
        _this.domNode.addEventListener("click", _this.handleClick.bind(_this));
        _this.domNode.className += " fancy-select-child hidden ";
        return _this;
    }

    _createClass(FancySelectElement, [{
        key: "handleClick",
        value: function handleClick() {
            this.parent.setData("value", this.value);
            this.parent.toggleDropdown();
        }
    }]);

    return FancySelectElement;
}(_Component4.default);

var FancySelect = function (_Component2) {
    _inherits(FancySelect, _Component2);

    function FancySelect() {
        var cfg = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, FancySelect);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(FancySelect).call(this, cfg));

        var el = cfg.el;
        var values = cfg.values;


        _this2.values = values;
        _this2.domNode = document.getElementById(el);
        _this2.shown = false;

        _this2.domNode.textContent = "";

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = values[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var val = _step.value;

                var c = new FancySelectElement({
                    value: val
                });

                _this2.addChild(c);
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

        _this2.on("change", _this2.handleChange.bind(_this2));
        _this2.setData("value", _this2.values[0]);
        _this2.hideDropdown();
        _this2.domNode.className += " fancy-select ";
        return _this2;
    }

    _createClass(FancySelect, [{
        key: "isValid",
        value: function isValid(key, value) {
            if (key === "value") {
                return this.values.indexOf(value) !== -1;
            }
            return false;
        }
    }, {
        key: "handleChange",
        value: function handleChange(_ref) {
            var key = _ref.key;
            var value = _ref.value;
            var valid = _ref.valid;

            if (valid) {
                this.positionChildren();
            }
        }
    }, {
        key: "positionChildren",
        value: function positionChildren() {
            var valInd = this.values.indexOf(this.getData("value"));
            var half = Math.floor(this.values.length / 2);
            for (var i = 0; i < this.children.length; i++) {
                var child = this.children[i];
                child.domNode.style.zIndex = i === valInd ? 1 : 0;
                var top = i - valInd;

                if (top > half) {
                    top -= this.children.length;
                } else if (top < -half) {
                    top += this.children.length;
                }

                child.domNode.style.top = top * 100 + "%";
            }
        }
    }, {
        key: "showDropdown",
        value: function showDropdown() {
            this.positionChildren();
            this.shown = true;
        }
    }, {
        key: "hideDropdown",
        value: function hideDropdown() {
            console.log(this.getData("value"));
            var valInd = this.values.indexOf(this.getData("value"));
            for (var i = 0; i < this.children.length; i++) {
                var child = this.children[i];
                child.domNode.style.zIndex = -Math.abs(i - valInd);
                child.domNode.style.top = "0%";
            }
            this.shown = false;
        }
    }, {
        key: "toggleDropdown",
        value: function toggleDropdown() {
            if (this.shown) {
                this.hideDropdown();
            } else {
                this.showDropdown();
            }
        }
    }]);

    return FancySelect;
}(_Component4.default);

exports.default = FancySelect;