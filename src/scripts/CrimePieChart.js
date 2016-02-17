import _ from "underscore";

import Component from "./Component.js";
import tinycolor from "tinycolor2";
import hub from "./datahub.js";
import crimedata from "./crimedata.js";
import filtercrimes from "./util/filtercrimes.js";
import constants from "./constants.js";

/* Taken from StackOverflow: http://stackoverflow.com/a/18473154 */
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
    
    return {
        x: (centerX + (radius * Math.cos(angleInRadians))).toFixed(3),
        y: (centerY + (radius * Math.sin(angleInRadians))).toFixed(3)
    };
}

function describeArc(x, y, radius, startAngle, endAngle){
    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);
    
    var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
    
    var d = [
        "M", start.x, start.y, 
        "A", radius, radius, 0, arcSweep, 0, end.x, end.y
    ].join(" ");
    
    return d;       
}

const SVGNS = "http://www.w3.org/2000/svg";

class PieSlice extends Component {
    constructor(data, start, amt) {
        super(data);
        let {color = 0xCCCCCC} = data;
        this.domNode = document.createElementNS(SVGNS, "g");
        this.arcNode = document.createElementNS(SVGNS, "path");
        this.triNode = document.createElementNS(SVGNS, "path");
        this.start = start;
        this.amt = amt;
        this.color = tinycolor(color.toString(16));
        
        this.domNode.setAttribute("class", "pie-chart-slice");
        this.domNode.appendChild(this.arcNode);
        this.domNode.appendChild(this.triNode);
        
        this.update();
        this.parent.addChild(this);
    }
    update() {
        let pos1 = polarToCartesian(0, 0,
            this.parent.radius, 0),
            pos2 = polarToCartesian(0, 0,
                this.parent.radius, this.amt);
        
        this.domNode.style.transform = `translate(${this.parent.x}px, ${this
            .parent.y}px) rotate(${this.start}deg)`;
        this.arcNode.setAttribute("d", describeArc(0, 0,
            this.parent.radius, 0, this.amt));
        this.arcNode.setAttribute("fill", this.color.toHexString());
        this.arcNode.setAttribute("stroke-width", 1);
        this.arcNode.setAttribute("stroke", this.color.toHexString());
        this.triNode.setAttribute("d",
            `M0 0 L${pos1.x} ${pos1.y} L${pos2.x} ${pos2.y}`);
        this.triNode.setAttribute("fill", this.color.toHexString());
        this.triNode.setAttribute("stroke-width", 1);
        this.triNode.setAttribute("stroke", this.color.toHexString());
    }
    setDisplay({start = this.start, amt = this.amt}) {
        this.start = start;
        this.amt = amt;
        this.update();
    }
}

export class CrimePieChart extends Component {
    constructor(data) {
        super(data);
        let {el} = data;
        this.domNode = document.getElementById(el);
        this.x = 50;
        this.y = 50;
        this.radius = 40;
        this.slices = [];
        
        let year = (new Date()).getFullYear();
        if (!crimedata.hasYearLoaded(year)) {
            crimedata.onYearLoad(year, this.initData.bind(this));
        }
        
        hub.on("data_loaded", this.displayData.bind(this));
        hub.on("filter_changed", this.handleFilterChange.bind(this));
    }
    getCrimeCounts() {
        let counts = Array.apply(null, Array(constants.crimeTypes.length))
            .map(function() {return 0;});
        
        let {crimes, allLoaded} = filtercrimes();
        let total = 0;
        
        for (let {crime, show} of crimes) {
            if (show) {
                total += 1;
                counts[constants.crimeIds[constants.typeMap[crime.primary_type]]] += 1;
            }
        }
        
        return {
            counts: counts,
            total: total
        };
    }
    initData() {
        let {counts, total} = this.getCrimeCounts();
        let start = 0;
        
        this.slices = counts.map((val, i) => {
            let amt = val / total * 360;
            
            let n = new PieSlice({
                parent: this,
                color: constants.colors[constants.crimeTypes[i]].fill
            }, start, amt);
            start += amt;
            return n;
        });
        
        this.displayData();
    }
    displayData() {
        let {counts, total} = this.getCrimeCounts();
        
        let start = 0;
        
        for (let i = 0; i < this.slices.length; i++) {
            let amt = counts[i] / total * 360;
            this.slices[i].setDisplay({
                start: start,
                amt: amt
            });
            start += amt;
        }
    }
    handleFilterChange({filterKey}) {
        if (filterKey === "type_filter") {
            this.displayData();
        }
    }
}

export default CrimePieChart;
