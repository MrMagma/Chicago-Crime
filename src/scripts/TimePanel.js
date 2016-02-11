import Component from "./Component.js";
import FancySelect from "./FancySelect.js";
import constants from "./constants.js";

class TimePanel extends Component {
    constructor(cfg = {}) {
        super(cfg);
        let {el, year, month} = cfg;
        
        this.initData("month", month);
        this.initData("year", year);
        
        this.domNode = document.getElementById(el);
        
        new FancySelect({
            el: "year-min-select",
            start: (new Date()).getFullYear(),
            values: constants.years,
            listeners: {
                change: ({val}) => {
                    this.setData("year", {
                        min: val,
                        max: this.getData("year").max
                    });
                }
            }
        });
        new FancySelect({
            el: "year-max-select",
            start: (new Date()).getFullYear(),
            values: constants.years,
            listeners: {
                change: ({val}) => {
                    this.setData("year", {
                        min: this.getData("year").min,
                        max: val
                    });
                }
            }
        });
        new FancySelect({
            el: "month-min-select",
            start: "Jan",
            values: constants.months,
            listeners: {
                change: ({val}) => {
                    this.setData("month", {
                        min: val,
                        max: this.getData("month").max
                    });
                }
            }
        });
        new FancySelect({
            el: "month-max-select",
            start: "Dec",
            values: constants.months,
            listeners: {
                change: ({val}) => {
                    this.setData("month", {
                        min: this.getData("month").min,
                        max: val
                    });
                }
            }
        });
    }
}

export default TimePanel;
