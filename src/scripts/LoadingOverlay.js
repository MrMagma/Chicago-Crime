class LoadingOverlay {
    constructor(el) {
        this.el = document.createElement("div");
        this.spinContainer = document.createElement("div");
        this.spinner = document.createElement("i");
        
        this.el.className = "loading-overlay";
        this.spinContainer.className = "spinner";
        this.spinner.className = "fa fa-circle-o-notch";
        
        this.spinContainer.appendChild(this.spinner);
        this.el.appendChild(this.spinContainer);
        
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

module.exports = LoadingOverlay;
