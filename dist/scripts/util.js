"use strict";

module.exports = {
    lerp: function lerp(v1, v2, amt) {
        return v1 + (v2 - v1) * amt;
    }
};