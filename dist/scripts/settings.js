"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var storageKey = "chicagoCrimePreferences";

var storedPrefs = localStorage.getItem(storageKey);

var settings = storedPrefs !== null ? JSON.parse(storedPrefs) : {};
var callbacks = {};

var settingsutil = {
    getPref: function getPref(name) {
        return settings[name];
    },
    setPref: function setPref(name, val) {
        settings[name] = val;

        if (!_underscore2.default.isArray(callbacks[name])) {
            callbacks[name] = [];
        }

        var cbData = {
            name: name,
            value: val
        };

        if (Object.freeze) {
            Object.freeze(cbData);
        }

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = callbacks[name][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var callback = _step.value;

                callback(cbData);
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
    },
    onPrefChange: function onPrefChange(name, cb) {
        if (!_underscore2.default.isFunction(cb) || !_underscore2.default.isArray(cb)) {
            return;
        }

        if (!_underscore2.default.isArray(cb)) {
            cb = [cb];
        }
        cb = cb.filter(_underscore2.default.isFunction);

        if (!callbacks[name]) {
            callbacks[name] = [];
        }
        callbacks[name].push.apply(callbacks[name], cb);
    }
};

window.addEventListener("beforeunload", function () {
    localStorage.setItem(storageKey, JSON.stringify(settings));
});

exports.default = settingsutil;