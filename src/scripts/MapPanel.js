import _ from "underscore";
import tinycolor from "tinycolor2";

import Component from "./Component.js";
import LoadingOverlay from "./LoadingOverlay.js";
import crimedata from "./crimedata.js";
import constants from "./constants.js";

function iconCreator(cluster) {
    let {stroke, fill} = cluster.getAllChildMarkers()
        .map(marker => {
            return constants.colors[marker.options.crimeType];
        })
        .reduce((pVal, cVal, i) => {
            return {
                stroke: (pVal.stroke + cVal.stroke) / 2,
                fill: (pVal.fill + cVal.fill) / 2
            };
        });
    
    fill = tinycolor(Math.round(fill).toString(16)).toHexString();
    stroke = tinycolor(fill);
    if (stroke.isDark()) {
        stroke.brighten(35).toHexString();
    } else {
        stroke.desaturate(35).toHexString();
    }
    
    let sz = 24 * (1 + (cluster.getChildCount() / 200));
    
    let icon = L.divIcon({
        className: "crime-icon",
        iconSize: new L.Point(sz, sz),
        html: `<div class="crime-icon-inner" style="
            background-color: ${fill};
            border: 0.2em solid ${stroke};"></div>`
    });
    
    return icon;
}

function sortDateRange({min, max}) {
    min = min.getTime();
    max = max.getTime();
    return {
        min: new Date(Math.min(min, max)),
        max: new Date(Math.max(min, max))
    };
}

class MapPanel extends Component {
    constructor(cfg = {}) {
        super(cfg);
        let {lat = 10, lng = 10, zoom = 11, el = "map", bounds = {
            southWest: L.latLng(-Infinity, -Infinity),
            northEast: L.latLng(Infinity, Infinity),
            zoom: {
                min: 10,
                max: 21
            }
        }, range} = cfg;
        
        this.domNode = document.getElementById(el);
        this.map = L.mapbox.map(this.domNode, "mapbox.streets", {
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
        
        this.spinner = new LoadingOverlay({
            message: "Fetching data. Please wait..."
        });
        
        this.addChild(this.spinner);
        this.on("change", this.handleChange.bind(this));
        this.initData("date_filter", range);
        let typeFilter = {};
        for (let type of constants.crimeTypes) {
            typeFilter[type] = true;
        }
        this.initData("type_filter", typeFilter);
        
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
        // TODO (Joshua): This is not the most performant thing to do and
        // should be fixed in the future, but for now it'll work fine.
        this.clusterer.clearLayers();
        let dateFilter = sortDateRange(this.getData("date_filter"));
        let typeFilter = this.getData("type_filter");
        console.log(dateFilter);
        let crimes = crimedata.all({
            where(crime) {
                let epoch = crime.date.getTime();
                return (epoch >= dateFilter.min && epoch <= dateFilter.max);
            }
        });
        
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
    handleChange() {
        // this.displayData();
    }
}

export default MapPanel;
