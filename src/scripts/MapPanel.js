var d3 = require("d3");
var _ = require("underscore");

var LoadingOverlay = require("./LoadingOverlay.js");
var CrimeMap = require("./CrimeMap.js");
var crimedata = require("./crimedata.js");
var constants = require("./constants.js");

class MapPanel {
    constructor(cfg = {}) {
        let {lat = 10, lng = 10, zoom = 11, el, bounds = {
            southWest: L.latLng(-Infinity, -Infinity),
            northEast: L.latLng(Infinity, Infinity),
            zoom: {
                min: 10,
                max: 21
            }
        }} = cfg;
        
        this.d3el = d3.select(el);
        this.map = L.mapbox.map("map", "mapbox.streets", {
            maxBounds: L.latLngBounds(bounds.southWest, bounds.northEast),
            maxZoom: bounds.zoom.max,
            minZoom: bounds.zoom.min
        }).setView([lat, lng], zoom);
        this.clusterer = new L.MarkerClusterGroup({
            polygonOptions: {
                fillColor: "rgba(0, 0, 0, 0)",
                color: "rgba(0, 0, 0, 0)"
            },
            iconCreateFunction(cluster) {
                return L.divIcon({
                    className: "hide",
                    // TODO (Joshua): This is very messy and stupid and needs to be fixed soon (tomorrow)
                    html: `<div class="crime-icon" style="background-color: #${
                        cluster.getAllChildMarkers().reduce((pVal, cVal, i) => {
                            if (i === 1) {
                                pVal = constants.colors[pVal.options
                                    .crimeType].fill;
                            }
                            return (pVal + constants.colors[cVal.options
                                .crimeType].fill) / 2;
                        }).toString(16).slice(0, 6)};width: 24px;height: 24px;visibility: visible;"></div>`
                });
            },
            maxClusterRadius: 30
        });
        this.spinner = new LoadingOverlay(this.d3el.node());       
        
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
        let crimes = crimedata.all();
        
        for (let crime of crimes) {
            this.clusterer.addLayer(new L.Marker(L.latLng(crime.latitude, crime.longitude), {
                icon: L.divIcon({
                    className: `${constants.css.classPrefix}-${crime
                        .primary_type.replace(" ", "_")} crime-icon`,
                    iconSize: new L.Point(18, 18)
                }),
                title: "Crime doesn't pay",
                crimeType: crime.primary_type
            }));
        }
        
        this.map.addLayer(this.clusterer);
    }
}

module.exports = MapPanel;
