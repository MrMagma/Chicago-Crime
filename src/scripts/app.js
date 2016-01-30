var d3 = require("d3");
var _ = require("underscore");

var MapPanel = require("./MapPanel.js");

// var map = new google.maps.Map(d3.select("#map").node(), {
//     center: {lat: 41.8339037, lng: -87.872238},
//     zoom: 11,
//     disableDefaultUI: true,
//     mapTypeId: google.maps.MapTypeId.ROADMAP
// });


var map = new MapPanel({
    el: "#map",
    lat: 41.8339037,
    lng: -87.872238
});
