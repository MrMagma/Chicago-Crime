"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Component2 = require("./Component.js");

var _Component3 = _interopRequireDefault(_Component2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var LoadingOverlay = function (_Component) {
    _inherits(LoadingOverlay, _Component);

    function LoadingOverlay(data) {
        _classCallCheck(this, LoadingOverlay);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LoadingOverlay).call(this, data));

        var _data$message = data.message;
        var message = _data$message === undefined ? "" : _data$message;
        var el = data.el;

        _this.domNode = document.createElement("div");
        _this.spinContainer = document.createElement("div");
        _this.spinner = document.createElement("i");
        _this.messageEl = document.createElement("p");

        _this.domNode.className = "loading-overlay";
        _this.spinContainer.className = "spinner";
        _this.spinner.className = "fa fa-circle-o-notch";
        _this.messageEl.className = "loading-message";
        _this.messageEl.textContent = message.toString();

        _this.spinContainer.appendChild(_this.spinner);
        _this.domNode.appendChild(_this.spinContainer);
        _this.domNode.appendChild(_this.messageEl);
        return _this;
    }

    _createClass(LoadingOverlay, [{
        key: "show",
        value: function show() {
            this.domNode.style.display = "block";
            this.domNode.style.opacity = 1.0;
        }
    }, {
        key: "hide",
        value: function hide() {
            var _this2 = this;

            this.domNode.style.opacity = 0;
            setTimeout(function () {
                _this2.domNode.style.display = "none";
            }, 300);
        }
    }]);

    return LoadingOverlay;
}(_Component3.default);

exports.default = LoadingOverlay;