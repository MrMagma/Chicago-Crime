"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function parseURL(url) {
    var urlDat = url.match(/([^?]+)(?:\?(.+)){0,1}/);

    if (urlDat === null) {
        return {
            address: "",
            data: {}
        };
    } else {
        var data = {};

        if (urlDat[2]) {
            var params = urlDat[2].split("&");

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = params[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var param = _step.value;

                    var _param$split = param.split("=");

                    var _param$split2 = _slicedToArray(_param$split, 2);

                    var key = _param$split2[0];
                    var _param$split2$ = _param$split2[1];
                    var value = _param$split2$ === undefined ? null : _param$split2$;

                    data[key] = value;
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

        return {
            address: urlDat[1],
            data: data
        };
    }
}

function stringifyURLParams(params) {
    var paramStr = "?";

    for (var key in params) {
        if (params.hasOwnProperty(key)) {
            if (paramStr.length > 1) {
                paramStr += "&";
            }

            if (params[key] === null || params[key] === undefined) {
                paramStr += key;
            } else {
                paramStr += key + "=" + params[key].toString();
            }
        }
    }

    return paramStr;
}

var JSONRequest = function () {
    function JSONRequest() {
        var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, JSONRequest);

        var url = data.url;
        var _data$method = data.method;
        var method = _data$method === undefined ? "GET" : _data$method;
        var _data$params = data.params;
        var params = _data$params === undefined ? {} : _data$params;
        var _data$onload = data.onload;
        var onload = _data$onload === undefined ? function () {} : _data$onload;
        var jsonp = data.jsonp;

        var _parseURL = parseURL(url);

        var address = _parseURL.address;
        var urlParams = _parseURL.urlParams;

        this.url = address;
        this.params = _underscore2.default.extendOwn(params, urlParams);
        this.jsonp = /\.jsonp$/.test(this.url) || jsonp;
        this.onload = onload;
        this.method = method;
    }

    _createClass(JSONRequest, [{
        key: "send",
        value: function send() {
            var _this = this;

            if (this.jsonp) {
                (function () {
                    var callbackName = "jsonReq" + Math.floor(Math.random() * 10000);
                    global[callbackName] = function (json) {
                        _this.onload(json);
                        delete global[callbackName];
                    };
                    _this.params.format = "jsonp";
                    _this.params.callback = callbackName;
                    var script = document.createElement("script");
                    script.setAttribute("type", "text/javascript");
                    script.setAttribute("src", _this.url + stringifyURLParams(_this.params));
                    document.body.appendChild(script);
                })();
            } else {
                (function () {
                    var self = _this;
                    var req = new XMLHttpRequest();
                    req.addEventListener("load", function () {
                        self.onload(JSON.parse(this.responseText));
                    });
                    req.open(_this.method, _this.url + stringifyURLParams(_this.params));
                    req.send();
                })();
            }
        }
    }]);

    return JSONRequest;
}();

exports.default = JSONRequest;