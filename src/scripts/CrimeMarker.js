import constants from "./constants.js";

var crimes = {};

class CrimeMarker {
    constructor(crime, clusterer) {
        this.crime = crime;
        this.marker = new L.Marker(L.latLng(crime.latitude, crime.longitude), {
            icon: L.divIcon({
                className: `${constants.css.classPrefix}-${constants
                    .typeMap[crime.primary_type].replace(/ /g,
                        "_")} crime-icon single-crime-icon`,
                iconSize: new L.Point(18, 18)
            }),
            title: crime.primary_type,
            crimeType: crime.primary_type
        });
        this.clusterer = clusterer;
        this.shown = false;
        this.id = crime.id;
        this.hideTimeout = null;
        
        this.show();
    }
    show() {
        if (!this.shown) {
            clearTimeout(this.hideTimeout);
            this.clusterer.addLayer(this.marker);
            this.marker.setOpacity(1);
            this.shown = true;
        }
    }
    hide() {
        if (this.shown) {
            clearTimeout(this.hideTimeout);
            this.marker.setOpacity(0);
            this.hideTimeout = setTimeout(() => {
                this.clusterer.removeLayer(this.marker);
            }, 300);
            this.shown = false;
        }
    }
    static getMarkerForCrime(crime, clusterer) {
        let {id} = crime;
        if (!crimes.hasOwnProperty(id)) {
            crimes[id] = new CrimeMarker(crime, clusterer);
        }
        return crimes[id];
    }
}

export default CrimeMarker;
