var d3 = require("d3");
var _ = require("underscore");

var Crime = require("./Crime.js");
var constants = require("./constants.js");

class CrimeMap {
    constructor(el) {
        let w = Math.abs(constants.map.lng.max - constants.map.lng.min),
            h = Math.abs(constants.map.lat.max - constants.map.lat.min);
        console.log(w, h);
        this.svg = d3.select(el).append("svg")
            .attr("class", "map-overlay")
            .attr("viewBox", `0 0 ${w} ${h}`)
            .attr("width", 1)
            .attr("height", 1)
            .append("g")
            .attr("transform", `scale(${w}, ${-h}) translate(${-constants.map
                .lng.min}, ${-constants.map.lat.min - h * 1.5})`);
        this.crimes = [];
    }
    add(data) {
        if (!_.isArray(data)) {
            data = [data];
        }
        
        let svgNode = this.svg.node();
        
        data = data.filter(crime => _.isObject(crime)).map(crimeData =>
            new Crime(svgNode, crimeData));
        
        this.crimes.push.apply(this.crimes, data);
    }
    hide(where = () => true) {
        for (let crime of this.crimes) {
            if (where(crime)) {
                crime.hide();
            }
        }
    }
    show(where = () => true) {
        for (let crime of this.crimes) {
            if (where(crime)) {
                crime.hide();
            }
        }
    }
}

module.exports = CrimeMap;
