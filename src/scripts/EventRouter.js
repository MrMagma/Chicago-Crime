import _ from "underscore";

var cbIdKey = "__appCustomEventCallbackId";

var callbackify = (function() {
    let id = 0;
    
    return function(cb) {
        cb[cbIdKey] = id++;
        return cb;
    };
})();

class EventRouter {
    constructor(cfg = {}) {
        this._listeners = {};
        
        for (let evt in cfg) {
            if (cfg.hasOwnProperty(evt)) {
                this.on(evt, cfg[evt]);
            }
        }
    }
    on(evt, callbacks) {
        if (!_.isString(evt)) {
            return;
        }
        
        if (!_.isArray(this._listeners[evt])) {
            this._listeners[evt] = [];
        }
        
        if (!_.isArray(callbacks)) {
            callbacks = [callbacks];
        }
        
        callbacks = callbacks.filter(cb => _.isFunction(cb))
            .map(callbackify);
        
        this._listeners[evt].push.apply(this._listeners[evt], callbacks);
        
        return this;
    }
    off(evt, callbacks) {
        if (!_.isString(evt) || !this._listeners.hasOwnProperty(evt) ||
            !_.isArray(this._listeners[evt])) {
            return;
        }
        
        if (!_.isArray(callbacks)) {
            callbacks = [callbacks];
        }
        
        callbacks = callbacks.filter(cb => _.isFunction(cb))
            .map(cb => cb[cbIdKey]);
        
        this._listeners[evt] = this._listeners[evt]
            .filter(cb => callbacks.indexOf(cb[cbIdKey]) !== -1);
        
        return this;
    }
    shouldFire() {
        return true;
    }
    fire(evt, ...args) {
        if (this.shouldFire(evt, args) && this._listeners.hasOwnProperty(evt)) {
            for (let cb of this._listeners[evt]) {
                cb.apply(cb, args);
            }
        }
    }
}

export default EventRouter;
