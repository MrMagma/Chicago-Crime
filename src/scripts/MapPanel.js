var d3 = require("d3");
var _ = require("underscore");

var LoadingOverlay = require("./LoadingOverlay.js");
let crimedata = require("./crimedata.js");
var mapsutil = require("./mapsutil.js");

var crimeTypes = [
    // Property
    "BURGLARY",
    "ROBBERY",
    "THEFT",
    "MOTOR VEHICLE THEFT",
    "ARSON",
    "DECEPTIVE PRACTICE",
    "CRIMINAL DAMAGE",
    // Personal
    "ASSAULT",
    "BATTERY",
    // Sexual
    "CRIMINAL SEXUAL ABUSE",
    "CRIM SEXUAL ASSAULT",
    "SEX OFFENSE",
    "PROSTITUTION",
    // Domestic
    "CRIMINAL TRESPASS",
    "PUBLIC PEACE VIOLATION",
    "INTERFERENCE WITH PUBLIC OFFICER",
    "KIDNAPPING",
    "OFFENSE INVOLVING CHILDREN",
    // Substances
    "NARCOTICS",
    "LIQUOR LAW VIOLATION",
    // OTHER
    "OTHER OFFENSE",
    "WEAPONS VIOLATION"
];

class MapPanel {
    constructor(cfg = {}) {
        let {lat = 10, lng = 10, zoom = 11, el, bounds = {
            min: new google.maps.LatLng(-Infinity, -Infinity),
            max: new google.maps.LatLng(Infinity, Infinity),
            zoom: [10, 21]
        }} = cfg;
        
        this.el = d3.select(el);
        this.map = new google.maps.Map(this.el.node(), {
            center: {lat: lat, lng: lng},
            zoom: zoom,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        
        mapsutil.boundMapPos(this.map, new google.maps.LatLngBounds(
            bounds.min,
            bounds.max
        ));

        mapsutil.boundMapZoom(this.map, bounds.zoom);
        
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
    displayData(year = (new Date()).getFullYear()) {
        year = year.toString();
        let crimes = crimedata.all({
            where: crime => crime.year === year
        });
        
        let crimePoints = crimes.map(crime => {
            return {
                location: new google.maps.LatLng(parseFloat(crime.latitude),
                    parseFloat(crime.longitude))
            };
        });
        
        var heatmap = new google.maps.visualization.HeatmapLayer({
            map: this.map,
            data: crimePoints,
            dissipating: true
        });
    }
}

module.exports = MapPanel;
