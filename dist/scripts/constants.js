"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var crimeColors = {
    property: {
        fill: 0x4CAF50,
        stroke: 0x69F0AE
    },
    personal: {
        fill: 0xF44336,
        stroke: 0xFF5252
    },
    sexual: {
        fill: 0xCDDC39,
        stroke: 0xEEFF41
    },
    minor_domestic: {
        fill: 0x03A9F4,
        stroke: 0x40C4FF
    },
    major_domestic: {
        fill: 0x3F51B5,
        stroke: 0x536DFE
    },
    substances: {
        fill: 0x795548,
        stroke: 0xA1887F
    },
    other: {
        fill: 0x9E9E9E,
        stroke: 0xBDBDBD
    }
};

exports.default = {
    map: {
        southWest: {
            lat: 41.5,
            lng: -88
        },
        northEast: {
            lat: 42.5,
            lng: -87
        },
        zoom: {
            min: 10,
            max: 21
        }
    },
    css: {
        classPrefix: "crime-type"
    },
    colors: {
        "BURGLARY": crimeColors.property,
        "ROBBERY": crimeColors.property,
        "THEFT": crimeColors.property,
        "MOTOR VEHICLE THEFT": crimeColors.property,
        "ARSON": crimeColors.property,
        "DECEPTIVE PRACTICE": crimeColors.property,
        "CRIMINAL DAMAGE": crimeColors.property,
        "ASSAULT": crimeColors.personal,
        "BATTERY": crimeColors.personal,
        "HOMICIDE": crimeColors.personal,
        "CRIMINAL SEXUAL ABUSE": crimeColors.sexual,
        "CRIM SEXUAL ASSAULT": crimeColors.sexual,
        "SEX OFFENSE": crimeColors.sexual,
        "PROSTITUTION": crimeColors.sexual,
        "CRIMINAL TRESPASS": crimeColors.minor_domestic,
        "PUBLIC PEACE VIOLATION": crimeColors.minor_domestic,
        "INTERFERENCE WITH PUBLIC OFFICER": crimeColors.minor_domestic,
        "KIDNAPPING": crimeColors.major_domestic,
        "OFFENSE INVOLVING CHILDREN": crimeColors.major_domestic,
        "STALKING": crimeColors.major_domestic,
        "NARCOTICS": crimeColors.substances,
        "LIQUOR LAW VIOLATION": crimeColors.substances,
        "OTHER OFFENSE": crimeColors.other,
        "WEAPONS VIOLATION": crimeColors.other
    },
    months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    years: [2011, 2012, 2013, 2014, 2015, 2016]
};