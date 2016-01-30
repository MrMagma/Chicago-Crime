let _ = require("underscore");

function parseURL(url) {
    var urlDat = url.match(/(.+)(?:\?(.+)){0,1}/);
    
    if (urlDat === null) {
        return {
            address: "",
            data: {}
        };
    } else {
        let data = {};
        
        if (urlDat[2]) {
            let params = urlDat[2].split("&");
            
            for (let param of params) {
                let [key, value = null] = param.split("=");
                data[key] = value;
            }
        }
        
        return {
            address: urlDat[1],
            data: data
        };
    }
}

function stringifyURLParams(params) {
    let paramStr = "?";
    for (let key in params) {
        if (params.hasOwnProperty(key)) {
            if (paramStr.length > 1) {
                paramStr += "&";
            }
            
            if (params[key] === null || params[key] === undefined) {
                paramStr += key;
            } else {
                paramStr += `${key}=${params[key].toString()}`;
            }
        }
    }
}

class JSONRequest {
    constructor(data = {}) {
        let {url, method = "GET", params = {}, onload = () => {}, jsonp} = data,
            {address, urlParams} = parseURL(url);
        this.url = address;
        this.params = _.extendOwn(params, urlParams);
        this.jsonp = /\.jsonp$/.test(this.url) || jsonp;
        this.onload = onload;
        this.method = method;
    }
    send() {
        if (this.jsonp) {
            let callbackName = `jsonReq${Math.floor(Math.random() * 10000)}`;
            global[callbackName] = (json) => {
                this.onload(json);
                delete global[callbackName];
            };
            this.params.format = "jsonp";
            this.params.callback = callbackName;
            let script = document.createElement("script");
            script.setAttribute("type", "text/javascript");
            script.setAttribute("src", this.url + stringifyURLParams(this.params));
            document.body.appendChild(script);
        } else {
            let req = new XMLHttpRequest();
            req.addEventListener("load", () => {
                this.onload(JSON.parse(this.responseText));
            });
            req.open(this.method, this.url + stringifyURLParams(this.params));
            req.send();
        }
    }
}

module.exports = JSONRequest;
