import Component from "./Component.js";

class FancySelectElement extends Component {
    constructor(cfg = {}) {
        super(cfg);
        let {value} = cfg;
        
        this.domNode = document.createElement("div");
        this.value = value;
        
        this.domNode.style.top = "0%";
        this.domNode.textContent = this.value;
        this.domNode.addEventListener("click", this.handleClick.bind(this));
        this.domNode.className += " fancy-select-child hidden ";
    }
    handleClick() {
        this.parent.setData("value", this.value);
        this.parent.toggleDropdown();
    }
}

class FancySelect extends Component {
    constructor(cfg = {}) {
        super(cfg);
        let {el, values, start = values[0]} = cfg;
        
        this.values = values;
        this.domNode = document.getElementById(el);
        this.shown = false;
        
        this.domNode.textContent = "";
        
        for (let val of values) {
            let c = new FancySelectElement({
                value: val
            });
            
            this.addChild(c);
        }
        
        this.domNode.className += " time-selector ";
        this.on("change", this.handleChange.bind(this));
        this.initData("value", start);
        this.hideDropdown();
        this.domNode.className += " fancy-select ";
        document.addEventListener("click", this.handleDocClick.bind(this));
    }
    isValid(key, value) {
        if (key === "value") {
            return this.values.indexOf(value) !== -1;
        }
        return false;
    }
    handleChange({key, value, valid}) {
        if (valid) {
            this.positionChildren();
        }
    }
    positionChildren() {
        let valInd = this.values.indexOf(this.getData("value"));
        let half = Math.floor(this.values.length / 2);
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            child.domNode.style.zIndex = i === valInd ? 1 : 0;
            let top = i - valInd;
            
            if (top > half) {
                top -= this.children.length;
            } else if (top < -half) {
                top += this.children.length;
            }
            
            child.domNode.style.top = `${top * 100}%`;
        }
    }
    showDropdown() {
        this.positionChildren();
        this.shown = true;
    }
    hideDropdown() {
        let valInd = this.values.indexOf(this.getData("value"));
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            child.domNode.style.zIndex = -Math.abs(i - valInd);
            child.domNode.style.top = "0%";
        }
        this.shown = false;
    }
    handleDocClick(evt) {
        let {path} = evt;
        while (path.length) {
            if (path.shift().id === this.domNode.id) {
                return;
            }
        }
        this.hideDropdown();
    }
    toggleDropdown() {
        if (this.shown) {
            this.hideDropdown();
        } else {
            this.showDropdown();
        }
    }
}

export default FancySelect;
