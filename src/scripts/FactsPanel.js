import Component from "./Component.js";

class FactPanel extends Component {
    constructor(cfg = {}) {
        super(cfg);
        let {el} = cfg;
        this.domNode = document.getElementById(el);
    }
}

export default FactPanel;
