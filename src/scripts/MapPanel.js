var d3 = require("d3");
var _ = require("underscore");

var LoadingOverlay = require("./LoadingOverlay.js");
let crimedata = require("./crimedata.js");
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
        
        this.spinner = new LoadingOverlay(this.el.node());
        
        this.loadData();
    }
    loadData() {
        let year = (new Date()).getFullYear();
        if (!crimedata.hasYearLoaded(year)) {
            if (!crimedata.isYearRequested(year)) {
                crimedata.loadYear(year);
            }
            // If our data is taking more than 1/2 second to load let people
            // know that we're actually doing something
            let spinTimer = setTimeout(this.spinner.show.bind(this.spinner),
                500);
            crimedata.onYearLoad(year, () => {
                clearTimeout(spinTimer);
                this.spinner.hide();
                this.displayData();
            });
        } else {
            this.displayData();
        }
    }
    displayData() {
        
    }
}

module.exports = MapPanel;
