var d3 = require("d3");

var constants = require("./constants.js");

class Crime {
    constructor(el, {latitude, longitude, primary_type: type, description}) {
        this.pos = {
            lat: latitude,
            lng: longitude
        };
        this.type = type;
        this.desc = description;
        this.el = d3.select(el).append("circle")
            .attr("cx", this.pos.lng)
            .attr("cy", this.pos.lat)
            .attr("r", 0.01)
            .attr("class", `${constants.css.data_prefix}-${type
                .replace(" ", "_")}`);
    }
    show() {
        this.el.style("display", "none");
    }
    hide() {
        this.el.style("display", "inline");
    }
}

module.exports = Crime;
