import _ from "underscore";

import EventRouter from "./EventRouter.js";

class DataStore extends EventRouter {
    constructor(data = {}) {
        super(data.listeners);
        if (!_.isObject(data)) {
            data = {};
        }
        this._data = {};
        this._validate = {
            
        };
    }
    getData(key) {
        if (this._data.hasOwnProperty(key)) {
            return this._data[key];
        }
    }
    _setData(key, value) {
        if (this._validate[key]) {
            this._data[key] = value;
        } else {
            this._validate[key] = () => true;
            this._data[key] = value;
        }
    }
    initData(key, value) {
        this._setData(key, value);
    }
    setData(key, value) {
        let valid = this.isValid(key, value) && (!this._validate[key] ||
            this._validate[key](value));
        if (valid) {
            this._setData(key, value);
        }
        this.fire("change", {
            key: key,
            value: value,
            valid: valid
        });
    }
    isValid(key, value) {
        return true;
    }
    validateData(key, validator) {
        if (!_.isFunction(validator)) {
            return;
        }
        
        this._validate[key] = validator;
    }
}

export default DataStore;
