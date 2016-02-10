"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var cbIdKey = "__appCustomEventCallbackId";

var callbackify = function () {
    var id = 0;

    return function (cb) {
        cb[cbIdKey] = id++;
        return cb;
    };
}();

var EventRouter = function () {
    function EventRouter() {
        _classCallCheck(this, EventRouter);

        this._listeners = {};
    }

    _createClass(EventRouter, [{
        key: "on",
        value: function on(evt, callbacks) {
            if (!_underscore2.default.isString(evt)) {
                return;
            }

            if (!_underscore2.default.isArray(this._listeners[evt])) {
                this._listeners[evt] = [];
            }

            if (!_underscore2.default.isArray(callbacks)) {
                callbacks = [callbacks];
            }

            callbacks = callbacks.filter(function (cb) {
                return _underscore2.default.isFunction(cb);
            }).map(callbackify);

            this._listeners[evt].push.apply(this._listeners[evt], callbacks);

            return this;
        }
    }, {
        key: "off",
        value: function off(evt, callbacks) {
            if (!_underscore2.default.isString(evt) || !this._listeners.hasOwnProperty(evt) || !_underscore2.default.isArray(this._listeners[evt])) {
                return;
            }

            if (!_underscore2.default.isArray(callbacks)) {
                callbacks = [callbacks];
            }

            callbacks = callbacks.filter(function (cb) {
                return _underscore2.default.isFunction(cb);
            }).map(function (cb) {
                return cb[cbIdKey];
            });

            this._listeners[evt] = this._listeners[evt].filter(function (cb) {
                return callbacks.indexOf(cb[cbIdKey]) !== -1;
            });

            return this;
        }
    }, {
        key: "shouldFire",
        value: function shouldFire() {
            return true;
        }
    }, {
        key: "fire",
        value: function fire(evt) {
            for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                args[_key - 1] = arguments[_key];
            }

            if (this.shouldFire(evt, args) && this._listeners.hasOwnProperty(evt)) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = this._listeners[evt][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var cb = _step.value;

                        cb.apply(cb, args);
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
        }
    }]);

    return EventRouter;
}();

exports.default = EventRouter;