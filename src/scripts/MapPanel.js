var d3 = require("d3");
var _ = require("underscore");

var JSONRequest = require("./JSONRequest.js");
var mapsutil = require("./mapsutil.js");

class MapPanel {
    constructor(cfg = {}) {
        let {lat = 10, lng = 10, zoom = 11, el} = cfg;
        
        this.el = d3.select(el);
        this.map = new google.maps.Map(this.el.node(), {
            center: {lat: lat, lng: lng},
            zoom: zoom,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        
        mapsutil.boundMapPos(this.map, new google.maps.LatLngBounds(
            new google.maps.LatLng(41.5, -88),
            new google.maps.LatLng(42, -87.5)
        ));

        mapsutil.boundMapZoom(this.map, [10, 21]);
    }
}

module.exports = MapPanel;
