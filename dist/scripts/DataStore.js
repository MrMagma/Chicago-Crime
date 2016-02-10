"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _EventRouter2 = require("./EventRouter.js");

var _EventRouter3 = _interopRequireDefault(_EventRouter2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var DataStore = function (_EventRouter) {
    _inherits(DataStore, _EventRouter);

    function DataStore() {
        var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, DataStore);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(DataStore).call(this, data.listeners));

        if (!_underscore2.default.isObject(data)) {
            data = {};
        }
        _this._data = data;
        _this._validate = {};
        return _this;
    }

    _createClass(DataStore, [{
        key: "getData",
        value: function getData(key) {
            if (this._data.hasOwnProperty(key)) {
                return this._data[key];
            }
        }
    }, {
        key: "setData",
        value: function setData(key, value) {
            var valid = this.isValid(key, value) && this._validate[key] && this._validate[key](value);
            if (valid) {
                this._data[key] = value;
            } else {
                this._validate[key] = function () {
                    return true;
                };
                this._data[key] = value;
            }
            this.fire("change", {
                key: key,
                value: value,
                valid: valid
            });
        }
    }, {
        key: "isValid",
        value: function isValid(key, value) {
            return true;
        }
    }, {
        key: "validateData",
        value: function validateData(key, validator) {
            if (!_underscore2.default.isFunction(validator)) {
                return;
            }

            this._validate[key] = validator;
        }
    }]);

    return DataStore;
}(_EventRouter3.default);

exports.default = DataStore;