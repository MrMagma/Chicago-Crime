"use strict";

var _ = require("underscore");

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

        if (!_.isArray(callbacks[name])) {
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
        if (!_.isFunction(cb) || !_.isArray(cb)) {
            return;
        }

        if (!_.isArray(cb)) {
            cb = [cb];
        }
        cb = cb.filter(_.isFunction);

        if (!callbacks[name]) {
            callbacks[name] = [];
        }
        callbacks[name].push.apply(callbacks[name], cb);
    }
};

window.addEventListener("beforeunload", function () {
    localStorage.setItem(storageKey, JSON.stringify(settings));
});

module.exports = settingsutil;