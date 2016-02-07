import Component from "./Component.js";

class LoadingOverlay extends Component {
    constructor(data) {
        super(data);
        let {message = "", el} = data;
        this.domNode = document.createElement("div");
        this.spinContainer = document.createElement("div");
        this.spinner = document.createElement("i");
        this.messageEl = document.createElement("p");
        
        this.domNode.className = "loading-overlay";
        this.spinContainer.className = "spinner";
        this.spinner.className = "fa fa-circle-o-notch";
        this.messageEl.className = "loading-message";
        this.messageEl.textContent = message.toString();
        
        this.spinContainer.appendChild(this.spinner);
        this.domNode.appendChild(this.spinContainer);
        this.domNode.appendChild(this.messageEl);
    }
    show() {
        this.domNode.style.display = "block";
        this.domNode.style.opacity = 1.0;
    }
    hide() {
        this.domNode.style.opacity = 0;
        setTimeout(() => {
            this.domNode.style.display = "none";
        }, 300);
    }
}

export default LoadingOverlay;
