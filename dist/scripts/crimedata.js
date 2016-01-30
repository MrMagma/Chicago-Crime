"use strict";

var _ = require("underscore");

var JSONRequest = require("./JSONRequest.js");

var crimedata = [];

var requested = {};
var loaded = {};
var callbacks = {};

var datautil = {
    hasYearLoaded: function hasYearLoaded(year) {
        return loaded[year];
    },
    isYearRequested: function isYearRequested(year) {
        return requested[year];
    },
    onYearLoad: function onYearLoad(year, cb) {
        if (!_.isFunction(cb) && !_.isArray(cb)) {
            return;
        }

        if (!_.isArray(cb)) {
            cb = [cb];
        }

        cb = cb.filter(function (val) {
            return _.isFunction(val);
        });

        if (!_.isArray(callbacks[year])) {
            callbacks[year] = [];
        }
        callbacks[year].push.apply(callbacks[year], cb);

        if (loaded[year]) {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = cb[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var callback = _step.value;

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
        }
    },
    loadYear: function loadYear(year) {
        if (!loaded[year] && year >= 2001) {
            if (!_.isArray(callbacks[year])) {
                callbacks[year] = [];
            }

            var req = new JSONRequest({
                url: "https://data.cityofchicago.org/resource/ijzp-q8t2.json",
                params: {
                    year: year
                }
            });

            req.onload = function (json) {
                crimedata.push.apply(crimedata, json.filter(function (val) {
                    return _.isString(val.latitude) && _.isString(val.longitude);
                }));
                loaded = true;
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = callbacks[year][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var cb = _step2.value;

                        cb();
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
            };

            req.send();

            requested[year] = true;
        }
    },
    all: function all() {
        var query = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
        var _query$where = query.where;
        var where = _query$where === undefined ? function () {
            return true;
        } : _query$where;

        return crimedata.filter(where);
    }
};

datautil.loadYear(new Date().getFullYear());

module.exports = datautil;