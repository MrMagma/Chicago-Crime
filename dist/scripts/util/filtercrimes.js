"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.filtercrimes = filtercrimes;

var _datahub = require("../datahub.js");

var _datahub2 = _interopRequireDefault(_datahub);

var _crimedata = require("../crimedata.js");

var _crimedata2 = _interopRequireDefault(_crimedata);

var _constants = require("../constants.js");

var _constants2 = _interopRequireDefault(_constants);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sortDateRange(_ref) {
    var min = _ref.min;
    var max = _ref.max;

    min = min.getTime();
    max = max.getTime();
    return {
        min: new Date(Math.min(min, max)),
        max: new Date(Math.max(min, max))
    };
}

function filtercrimes(stopEarly) {
    var dateFilter = sortDateRange(_datahub2.default.getData("date_filter"));
    var typeFilter = _datahub2.default.getData("type_filter");

    var min = dateFilter.min.getTime(),
        max = dateFilter.max.getTime();

    var notLoaded = [];
    var maxYear = dateFilter.max.getFullYear();
    for (var year = dateFilter.min.getFullYear(); year < maxYear; year++) {
        if (!_crimedata2.default.hasYearLoaded(year)) {
            notLoaded.push(year);
        }
    }

    if (notLoaded.length > 0 && stopEarly) {
        return {
            crimes: [],
            notLoaded: notLoaded
        };
    }

    var crimes = _crimedata2.default.all();

    return {
        crimes: crimes.map(function (crime) {
            var epoch = crime.date.getTime();
            return {
                crime: crime,
                show: epoch >= min && epoch <= max && typeFilter[_constants2.default.typeMap[crime.primary_type]]
            };
        }),
        notLoaded: notLoaded
    };
}

exports.default = filtercrimes;