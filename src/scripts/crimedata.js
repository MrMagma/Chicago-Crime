import _ from "underscore";

import JSONRequest from "./JSONRequest.js";
import hub from "./datahub.js";

let crimedata = [];

let requested = {};
let loaded = {};
let callbacks = {};
let activeRequests = 0;

let datautil = {
    hasYearLoaded(year) {
        return !!loaded[year];
    },
    isYearRequested(year) {
        return !!requested[year];
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
                crimedata.push.apply(crimedata, json.map(crime => {
                        crime.date = new Date(crime.date);
                        return crime;
                    })
                    .filter(val => _.isString(val.latitude) &&
                        _.isString(val.longitude)));
                loaded[year] = true;
                activeRequests -= 1;
                
                for (let cb of callbacks[year]) {
                    cb();
                }
                
                callbacks[year] = [];
                hub.fire("data_loaded", {
                    year: year
                });
            };
            
            activeRequests += 1;
            req.send();
            
            requested[year] = true;
        }
    },
    count() {
        return crimedata.length;
    },
    all(query = {}) {
        let {where = () => true} = query;
        
        return crimedata.filter(where);
    },
    isRequestActive() {
        return activeRequests > 0;
    }
};

datautil.loadYear((new Date()).getFullYear());

export default datautil;
