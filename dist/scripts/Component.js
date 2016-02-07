"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _underscore = require("underscore");

var _underscore2 = _interopRequireDefault(_underscore);

var _DataStore2 = require("./DataStore.js");

var _DataStore3 = _interopRequireDefault(_DataStore2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var idKey = "__appComponentId";

var getId = function () {
    var id = 0;

    return function (cb) {
        return id++;
    };
}();

var Component = function (_DataStore) {
    _inherits(Component, _DataStore);

    function Component() {
        var cfg = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

        _classCallCheck(this, Component);

        var _cfg$data = cfg.data;
        var data = _cfg$data === undefined ? {} : _cfg$data;
        var _cfg$children = cfg.children;
        var children = _cfg$children === undefined ? [] : _cfg$children;
        var _cfg$parent = cfg.parent;
        var parent = _cfg$parent === undefined ? null : _cfg$parent;

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Component).call(this, data));

        _this[idKey] = getId();
        _this.children = children;
        _this.parent = parent;
        _this.domNode = null;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = _this.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var child = _step.value;

                _this.appendChild(child);
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

        return _this;
    }

    _createClass(Component, [{
        key: "appendChild",
        value: function appendChild(child) {
            this.children.push(child);
            child.parent = this;
            this.domNode.appendChild(child.domNode);
            this.fire("child_added", child);
        }
    }, {
        key: "removeChild",
        value: function removeChild(child) {
            var id = child[idKey];

            if (!_underscore2.default.isNumber(id)) {
                return;
            }

            this.children = this.children.filter(function (testChild) {
                return _underscore2.default.isNumber(testChild[idKey]) && testChild[idKey] === id;
            });
            this.domNode.removeChild(child.domNode);
            this.fire("child_removed", child);
        }
    }, {
        key: "appendTo",
        value: function appendTo(container) {
            container.appendChild(this);
        }
    }, {
        key: "appendToDomNode",
        value: function appendToDomNode(node) {
            node.appendChild(this.domNode);
        }
    }, {
        key: "removeFromDomNode",
        value: function removeFromDomNode(node) {
            node.removeChild(this.domNode);
        }
    }, {
        key: "destroy",
        value: function destroy() {
            this.domNode.remove();
            this.fire("destroy");
        }
    }]);

    return Component;
}(_DataStore3.default);

exports.default = Component;