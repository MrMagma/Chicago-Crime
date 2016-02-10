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
        let {el, values} = cfg;
        
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
        
        this.on("change", this.handleChange.bind(this));
        this.setData("value", this.values[0]);
        this.hideDropdown();
        this.domNode.className += " fancy-select ";
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
        console.log(this.getData("value"));
        let valInd = this.values.indexOf(this.getData("value"));
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i];
            child.domNode.style.zIndex = -Math.abs(i - valInd);
            child.domNode.style.top = "0%";
        }
        this.shown = false;
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
