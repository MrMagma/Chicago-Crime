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
    },
    freezeMap: function freezeMap(map) {
        var center = map.getCenter();
        var zoom = map.getZoom();
        map.addListener("bounds_changed", function () {
            if (map.getZoom() !== zoom) {
                map.setZoom(zoom);
            }
            var nCenter = map.getCenter();
            if (nCenter.lat !== center.lat || nCenter.lng !== center.lng) {
                map.panTo(center);
            }
        });
    }
};

module.exports = mapsutil;