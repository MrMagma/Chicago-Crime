"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var d3 = require("d3");

var constants = require("./constants.js");

var Crime = function () {
    function Crime(el, _ref) {
        var latitude = _ref.latitude;
        var longitude = _ref.longitude;
        var type = _ref.primary_type;
        var description = _ref.description;

        _classCallCheck(this, Crime);

        this.pos = {
            lat: latitude,
            lng: longitude
        };
        this.type = type;
        this.desc = description;
        this.el = d3.select(el).append("circle").attr("cx", this.pos.lng).attr("cy", this.pos.lat).attr("r", 0.01).attr("class", constants.css.data_prefix + "-" + type.replace(" ", "_"));
    }

    _createClass(Crime, [{
        key: "show",
        value: function show() {
            this.el.style("display", "none");
        }
    }, {
        key: "hide",
        value: function hide() {
            this.el.style("display", "inline");
        }
    }]);

    return Crime;
}();

module.exports = Crime;