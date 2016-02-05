var d3 = require("d3");
var _ = require("underscore");
var tinycolor = require("tinycolor2");

var LoadingOverlay = require("./LoadingOverlay.js");
var CrimeMap = require("./CrimeMap.js");
var crimedata = require("./crimedata.js");
var constants = require("./constants.js");

function iconCreator(cluster) {
    let style = cluster.getAllChildMarkers()
        .map(marker => {
            return constants.colors[marker.options.crimeType];
        })
        .reduce((pVal, cVal, i) => {
            return {
                stroke: (pVal.stroke + cVal.stroke) / 2,
                fill: (pVal.fill + cVal.fill) / 2
            };
        });
    
    style.fill = tinycolor(Math.round(style.fill).toString(16)).toHexString();
    style.stroke = tinycolor(style.fill);
    if (style.stroke.isDark()) {
        style.stroke.brighten(35);
    } else {
        style.stroke.desaturate(35);
    }
    
    let sz = 24 * (1 + (cluster.getChildCount() / 200));
    
    let icon = L.divIcon({
        className: "crime-icon",
        iconSize: new L.Point(sz, sz),
        html: `<div class="crime-icon-inner" style="
            background-color: ${style.fill};
            border: 0.2em solid ${style.stroke};"></div>`
    });
    
    return icon;
}

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
            iconCreateFunction: iconCreator,
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
