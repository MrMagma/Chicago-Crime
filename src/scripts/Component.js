import _ from "underscore";

import DataStore from "./DataStore.js";

var idKey = "__appComponentId";

var getId = (function() {
    let id = 0;
    
    return function(cb) {
        return id++;
    };
})();

class Component extends DataStore {
    constructor(cfg = {}) {
        let {data = {}, children = [], parent = null} = cfg;
        super(data);
        this[idKey] = getId();
        this.children = children;
        this.parent = parent;
        this.domNode = null;
        for (let child of this.children) {
            this.appendChild(child);
        }
    }
    appendChild(child) {
        this.children.push(child);
        child.parent = this;
        this.domNode.appendChild(child.domNode);
        this.fire("child_added", child);
    }
    removeChild(child) {
        let id = child[idKey];
        
        if (!_.isNumber(id)) {
            return;
        }
        
        this.children = this.children
            .filter(testChild => _.isNumber(testChild[idKey]) &&
                testChild[idKey] === id);
        this.domNode.removeChild(child.domNode);
        this.fire("child_removed", child);
    }
    appendTo(container) {
        container.appendChild(this);
    }
    appendToDomNode(node) {
        node.appendChild(this.domNode);
    }
    removeFromDomNode(node) {
        node.removeChild(this.domNode);
    }
    destroy() {
        this.domNode.remove();
        this.fire("destroy");
    }
}

export default Component;
