import constants from "./constants.js";

var crimes = {};

class CrimeMarker {
    constructor(crime, clusterer) {
        this.crime = crime;
        this.marker = new L.Marker(L.latLng(crime.latitude, crime.longitude), {
            icon: L.divIcon({
                className: `${constants.css.classPrefix}-${crime
                    .primary_type.replace(" ", "_")} crime-icon`,
                iconSize: new L.Point(18, 18)
            }),
            title: "Crime doesn't pay",
            crimeType: crime.primary_type
        });
        this.clusterer = clusterer;
        this.shown = false;
        this.id = crime.id;
        
        this.show();
    }
    show() {
        if (!this.shown) {
            this.clusterer.addLayer(this.marker);
            this.shown = true;
        }
    }
    hide() {
        if (this.shown) {
            this.clusterer.removeLayer(this.marker);
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
