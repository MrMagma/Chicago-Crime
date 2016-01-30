var _ = require("underscore");

var JSONRequest = require("./JSONRequest.js");

let crimedata = [];

let requested = {};
let loaded = {};
let callbacks = {};

let datautil = {
    hasYearLoaded(year) {
        return loaded[year];
    },
    isYearRequested(year) {
        return requested[year];
    },
    onYearLoad(year, cb) {
        if (!_.isFunction(cb) && !_.isArray(cb)) {
            return;
        }
        
        if (!_.isArray(cb)) {
            cb = [cb];
        }
        
        cb = cb.filter(val => _.isFunction(val));
        
        if (!_.isArray(callbacks[year])) {
            callbacks[year] = [];
        }
        callbacks[year].push.apply(callbacks[year], cb);
        
        if (loaded[year]) {
            for (let callback of cb) {
                cb();
            }
        }
    },
    loadYear(year) {
        if (!loaded[year] && year >= 2001) {
            if (!_.isArray(callbacks[year])) {
                callbacks[year] = [];
            }
            
            let req = new JSONRequest({
                url: "https://data.cityofchicago.org/resource/ijzp-q8t2.json",
                params: {
                    year: year
                }
            });

            req.onload = (json) => {
                crimedata.push.apply(crimedata, json
                    .filter(val => _.isString(val.latitude) &&
                        _.isString(val.longitude)));
                loaded = true;
                for (let cb of callbacks[year]) {
                    cb();
                }
            };

            req.send();
            
            requested[year] = true;
        }
    },
    all(query = {}) {
        let {where = () => true} = query;
        
        return crimedata.filter(where);
    }
};

datautil.loadYear((new Date()).getFullYear());

module.exports = datautil;
