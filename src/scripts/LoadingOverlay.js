class LoadingOverlay {
    constructor(el, message = "Loading...") {
        this.el = document.createElement("div");
        this.spinContainer = document.createElement("div");
        this.spinner = document.createElement("i");
        this.messageEl = document.createElement("p");
        
        this.el.className = "loading-overlay";
        this.spinContainer.className = "spinner";
        this.spinner.className = "fa fa-circle-o-notch";
        this.messageEl.className = "loading-message";
        this.messageEl.textContent = message.toString();
        
        this.spinContainer.appendChild(this.spinner);
        this.el.appendChild(this.spinContainer);
        this.el.appendChild(this.messageEl);
        
        el.appendChild(this.el);
    }
    show() {
        this.el.style.display = "block";
        this.el.style.opacity = 1.0;
    }
    hide() {
        this.el.style.opacity = 0;
        setTimeout(() => {
            this.el.style.display = "none";
        }, 300);
    }
}

export default LoadingOverlay;
