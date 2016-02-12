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

var Toggle = function (_Component) {
    _inherits(Toggle, _Component);

    function Toggle() {
        var cfg = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, Toggle);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Toggle).call(this, cfg));

        var type = cfg.type;


        _this.domNode = document.createElement("div");
        _this.button = document.createElement("button");

        _this.domNode.className += " crime-toggle ";
        _this.button.className += " content crime-type-" + type + " ";
        _this.button.title = type.replace(/^./, function (ch) {
            return ch.toUpperCase();
        });
        _this.button.textContent = "B";
        _this.button.addEventListener("click", _this.handleClick.bind(_this));
        _this.domNode.appendChild(_this.button);
        _this.on("change", _this.handleChange.bind(_this));

        _this.initData("active", true);
        return _this;
    }

    _createClass(Toggle, [{
        key: "handleClick",
        value: function handleClick() {
            this.setData("active", !this.getData("active"));
        }
    }, {
        key: "handleChange",
        value: function handleChange() {
            if (this.getData("active")) {
                this.button.className = this.button.className.replace("toggle-inactive", "");
            } else {
                this.button.className += " toggle-inactive ";
            }
        }
    }]);

    return Toggle;
}(_Component4.default);

var TogglePanel = function (_Component2) {
    _inherits(TogglePanel, _Component2);

    function TogglePanel(cfg) {
        _classCallCheck(this, TogglePanel);

        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(TogglePanel).call(this, cfg));

        var types = cfg.types;
        var el = cfg.el;


        _this2.domNode = document.getElementById(el);

        _this2.initData("active", {});
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = types[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var type = _step.value;

                var toggle = new Toggle({
                    type: type
                });
                _this2.initData(type + "_is_active", toggle.getData("active"));
                _this2.getData("active")[type] = toggle.getData("active");
                _this2.listenToToggle(toggle, type);
                _this2.addChild(toggle);
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

        return _this2;
    }

    _createClass(TogglePanel, [{
        key: "listenToToggle",
        value: function listenToToggle(toggle, type) {
            var _this3 = this;

            toggle.on("change", function () {
                _this3.getData("active")[type] = toggle.getData("active");
                _this3.setData(type + "_is_active", toggle.getData("active"));
            });
        }
    }, {
        key: "getToggleState",
        value: function getToggleState(type) {
            return this.getData(type + "_is_active");
        }
    }]);

    return TogglePanel;
}(_Component4.default);

exports.default = TogglePanel;