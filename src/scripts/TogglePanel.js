import Component from "./Component.js";

class Toggle extends Component {
    constructor(cfg = {}) {
        super(cfg);
        let {type} = cfg;
        
        this.domNode = document.createElement("div");
        this.button = document.createElement("button");
        
        this.domNode.className += " crime-toggle ";
        this.button.className += ` content crime-type-${type} `;
        this.button.title = type.replace(/^./, ch => ch.toUpperCase());
        this.button.textContent = "B";
        this.button.addEventListener("click", this.handleClick.bind(this));
        this.domNode.appendChild(this.button);
        this.on("change", this.handleChange.bind(this));
        
        this.setData("active", true);
    }
    handleClick() {
        this.setData("active", !this.getData("active"));
    }
    handleChange() {
        if (this.getData("active")) {
            this.button.className = this.button.className.replace("toggle-inactive", "");
        } else {
            this.button.className += " toggle-inactive ";
        }
    }
}

class TogglePanel extends Component {
    constructor(cfg) {
        super(cfg);
        let {types, el} = cfg;
        
        this.domNode = document.getElementById(el);
        
        for (let type of types) {
            let toggle = new Toggle({
                type: type
            });
            this.setData(`${type}_is_active`, toggle.getData("active"));
            this.listenToToggle(toggle, type);
            this.addChild(toggle);
        }
    }
    listenToToggle(toggle, type) {
        toggle.on("change", () => {
            this.setData(`${type}_is_active`, toggle.getData("active"));
        });
    }
    getToggleState(type) {
        return this.getData(`${type}_is_active`);
    }
}

export default TogglePanel;
