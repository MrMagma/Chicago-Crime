import Component from "./Component.js";
import FancySelect from "./FancySelect.js";
import hub from "./datahub.js";
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
                change: ({value}) => {
                    this.setData("year", {
                        min: value,
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
                change: ({value}) => {
                    this.setData("year", {
                        min: this.getData("year").min,
                        max: value
                    });
                }
            }
        });
        new FancySelect({
            el: "month-min-select",
            start: "Jan",
            values: constants.months,
            listeners: {
                change: ({value}) => {
                    this.setData("month", {
                        min: value,
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
                change: ({value}) => {
                    this.setData("month", {
                        min: this.getData("month").min,
                        max: value
                    });
                }
            }
        });
        
        this.on("change", this.handleChange.bind(this));
    }
    handleChange() {
        let year = this.getData("year");
        let month = this.getData("month");
        hub.setData("date_filter", {
            min: new Date(`${month.min} ${year.min}`),
            max: new Date(`${month.max} ${year.max}`)
        });
        hub.fire("filter_changed", {
            filterKey: "date_filter"
        });
    }
}

export default TimePanel;
