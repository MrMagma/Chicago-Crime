"use strict";

var _ = require("underscore");

var JSONRequest = require("./JSONRequest.js");

var crimedata = {};
var loadCallbacks = [];
var loaded = false;

var req = new JSONRequest({
    url: "https://data.cityofchicago.org/resource/ijzp-q8t2.json"
});

req.onload = function (json) {
    crimedata = json;
    loaded = true;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = loadCallbacks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var cb = _step.value;

            cb();
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
};

req.send();

module.exports = {
    get hasLoaded() {
        return loaded;
    },
    onLoad: function onLoad(cb) {
        if (!_.isFunction(cb) && !_.isArray(cb)) {
            return;
        }

        if (!_.isArray(cb)) {
            cb = [cb];
        }

        cb = cb.filter(function (val) {
            return _.isFunction(val);
        });

        if (!loaded) {
            loadCallbacks.push.apply(loadCallbacks, cb);
        } else {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = cb[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var callback = _step2.value;

                    callback();
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }
    }
};