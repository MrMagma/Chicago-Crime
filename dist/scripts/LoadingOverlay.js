"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var LoadingOverlay = function () {
    function LoadingOverlay(el) {
        _classCallCheck(this, LoadingOverlay);

        this.el = document.createElement("div");
        this.spinContainer = document.createElement("div");
        this.spinner = document.createElement("i");

        this.el.className = "loading-overlay";
        this.spinContainer.className = "spinner";
        this.spinner.className = "fa fa-circle-o-notch";

        this.spinContainer.appendChild(this.spinner);
        this.el.appendChild(this.spinContainer);

        el.appendChild(this.el);
    }

    _createClass(LoadingOverlay, [{
        key: "show",
        value: function show() {
            this.el.style.display = "block";
            this.el.style.opacity = 1.0;
        }
    }, {
        key: "hide",
        value: function hide() {
            var _this = this;

            this.el.style.opacity = 0;
            setTimeout(function () {
                _this.el.style.display = "none";
            }, 300);
        }
    }]);

    return LoadingOverlay;
}();

module.exports = LoadingOverlay;