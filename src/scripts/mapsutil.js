var mapsutil = {
    boundMapPos(map, bounds) {
        let lastValid = map.getCenter();
        map.addListener("center_changed", () => {
            if (bounds.contains(map.getCenter())) {
                lastValid = map.getCenter();
            } else {
                map.panTo(lastValid);
            }
        });
    },
    boundMapZoom(map, bounds) {
        let lastValid = map.getZoom();
        map.addListener("zoom_changed", () => {
            let zoom = map.getZoom();
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
    freezeMap(map) {
        let center = map.getCenter();
        let zoom = map.getZoom();
        map.addListener("bounds_changed", () => {
            if (map.getZoom() !== zoom) {
                map.setZoom(zoom);
            }
            let nCenter = map.getCenter();
            if (nCenter.lat !== center.lat || nCenter.lng !== center.lng) {
                map.panTo(center);
            }
        });
    }
};

module.exports = mapsutil;
