"use strict";

var mapsutil = {
    boundMapPos: function boundMapPos(map, bounds) {
        var lastValid = map.getCenter();
        map.addListener("center_changed", function () {
            if (bounds.contains(map.getCenter())) {
                lastValid = map.getCenter();
            } else {
                map.panTo(lastValid);
            }
        });
    },
    boundMapZoom: function boundMapZoom(map, bounds) {
        var lastValid = map.getZoom();
        map.addListener("zoom_changed", function () {
            var zoom = map.getZoom();
            // Infinite recursion is not fun
            if (zoom === lastValid) {
                return;
            }

            if (zoom >= bounds[0] && zoom <= bounds[1]) {
                lastValid = zoom;
            } else {
                map.setZoom(lastValid);
            }
        });
    }
};

module.exports = mapsutil;