var _ = require("underscore");

let storageKey = "chicagoCrimePreferences";

let storedPrefs = localStorage.getItem(storageKey);

var settings = (storedPrefs !== null) ? JSON.parse(storedPrefs) : {};
var callbacks = {};

var settingsutil = {
    getPref(name) {
        return settings[name];
    },
    setPref(name, val) {
        settings[name] = val;
        
        if (!_.isArray(callbacks[name])) {
            callbacks[name] = [];
        }
        
        let cbData = {
            name: name,
            value: val
        };
        
        if (Object.freeze) {
            Object.freeze(cbData);
        }
        
        for (let callback of callbacks[name]) {
            callback(cbData);
        }
    },
    onPrefChange(name, cb) {
        if (!_.isFunction(cb) || !_.isArray(cb)) {
            return;
        }
        
        if (!_.isArray(cb)) {
            cb = [cb];
        }
        cb = cb.filter(_.isFunction);
        
        if (!callbacks[name]) {
            callbacks[name] = [];
        }
        callbacks[name].push.apply(callbacks[name], cb);
    }
};

window.addEventListener("beforeunload", function() {
    localStorage.setItem(storageKey, JSON.stringify(settings));
});

module.exports = settingsutil;
