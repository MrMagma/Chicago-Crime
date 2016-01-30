var _ = require("underscore");

var JSONRequest = require("./JSONRequest.js");

let crimedata = {};
let loadCallbacks = [];
let loaded = false;

let req = new JSONRequest({
    url: "https://data.cityofchicago.org/resource/ijzp-q8t2.json"
});

req.onload = (json) => {
    crimedata = json;
    loaded = true;
    for (let cb of loadCallbacks) {
        cb();
    }
};

req.send();

module.exports = {
    get hasLoaded() {
        return loaded;
    },
    onLoad(cb) {
        if (!_.isFunction(cb) && !_.isArray(cb)) {
            return;
        }
        
        if (!_.isArray(cb)) {
            cb = [cb];
        }
        
        cb = cb.filter(val => _.isFunction(val));
        
        if (!loaded) {
            loadCallbacks.push.apply(loadCallbacks, cb);
        } else {
            for (let callback of cb) {
                callback();
            }
        }
    }
};
