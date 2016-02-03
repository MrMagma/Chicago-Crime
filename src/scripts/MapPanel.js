var d3 = require("d3");
var _ = require("underscore");

var LoadingOverlay = require("./LoadingOverlay.js");
var CrimeMap = require("./CrimeMap.js");
let crimedata = require("./crimedata.js");
var mapsutil = require("./mapsutil.js");

class MapPanel {
    constructor(cfg = {}) {
        let {lat = 10, lng = 10, zoom = 11, el, bounds = {
            min: new google.maps.LatLng(-Infinity, -Infinity),
            max: new google.maps.LatLng(Infinity, Infinity),
            zoom: [10, 21]
        }} = cfg;
        
        this.el = d3.select(el);
        this.map = new google.maps.Map(this.el.append("div")
            .attr("class", "map-container").node(), {
            center: {lat: lat, lng: lng},
            zoom: zoom,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        this.spinner = new LoadingOverlay(this.el.node());
        this.crimeMap = new CrimeMap(this.el.node());
        
        mapsutil.boundMapPos(this.map, new google.maps.LatLngBounds(
            bounds.min,
            bounds.max
        ));

        mapsutil.boundMapZoom(this.map, bounds.zoom);
        
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
        this.crimeMap.add(crimedata.all());
        new google.maps.visualization.HeatmapLayer({
            map: this.map,
            data: crimedata.all().map(crime => new google.maps.LatLng(crime.latitude, crime.longitude))
        });
    }
}

module.exports = MapPanel;
