import Component from "./Component.js";
import hub from "./datahub.js";

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
        
        this.initData("active", true);
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
        
        this.initData("active", {});
        for (let type of types) {
            let toggle = new Toggle({
                type: type
            });
            this.initData(`${type}_is_active`, toggle.getData("active"));
            this.getData("active")[type] = toggle.getData("active");
            this.listenToToggle(toggle, type);
            this.addChild(toggle);
        }
        this.on("change", this.handleChange.bind(this));
    }
    listenToToggle(toggle, type) {
        toggle.on("change", () => {
            this.getData("active")[type] = toggle.getData("active");
            this.setData(`${type}_is_active`, toggle.getData("active"));
        });
    }
    getToggleState(type) {
        return this.getData(`${type}_is_active`);
    }
    handleChange() {
        hub.setData("type_filter", this.getData("active"));
        hub.emit("filter_changed", {
            filterKey: "type_filter"
        });
    }
}

export default TogglePanel;
