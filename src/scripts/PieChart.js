import Component from "./Component.js";
import tinycolor from "tinycolor2";

/* Taken from StackOverflow: http://stackoverflow.com/a/18473154 */
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
    
    return {
        x: centerX + (radius * Math.cos(angleInRadians)),
        y: centerY + (radius * Math.sin(angleInRadians))
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
        
        this.domNode.appendChild(this.arcNode);
        this.domNode.appendChild(this.triNode);
        this.update();
    }
    update() {
        let pos1 = polarToCartesian(this.parent.x, this.parent.y,
            this.parent.radius, this.start),
            pos2 = polarToCartesian(this.parent.x, this.parent.y,
                this.parent.radius, this.start + this.amt);
        
        this.arcNode.setAttribute("d", describeArc(this.parent.x, this.parent.y,
            this.parent.radius, this.start, this.start + this.amt));
        this.arcNode.setAttribute("fill", this.color.toHexString());
        this.triNode.setAttribute("d",
            `M50 50 L${pos1.x} ${pos1.y} L${pos2.x} ${pos2.y}`);
        this.triNode.setAttribute("fill", this.color.toHexString());
    }
}

export class PieChart extends Component {
    constructor(dat) {
        super(dat);
        let {data, el} = dat;
        this.domNode = document.getElementById(el);
        this.data = data.map(json => JSON.parse(JSON.stringify(json)));
        this.x = 50;
        this.y = 50;
        this.radius = 40;
        
        this.displayData();
    }
    displayData() {
        let start = 0;
        for (let dataEl of this.data) {
            dataEl.parent = this;
            let amt = dataEl.percent / 100 * 360;
            this.addChild(new PieSlice(dataEl, start, amt));
            start += amt;
        }
    }
    addData(data) {
        
    }
}

export default PieChart;
