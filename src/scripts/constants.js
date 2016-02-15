export default {
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
    typeMap: {
        "BURGLARY": "theft",
        "ROBBERY": "theft",
        "THEFT": "theft",
        "MOTOR VEHICLE THEFT": "theft",
        "ARSON": "property",
        "DECEPTIVE PRACTICE": "property",
        "CRIMINAL DAMAGE": "property",
        "ASSAULT": "personal",
        "BATTERY": "personal",
        "HOMICIDE": "personal",
        "CRIMINAL SEXUAL ABUSE": "sexual",
        "CRIM SEXUAL ASSAULT": "sexual",
        "SEX OFFENSE": "sexual",
        "PROSTITUTION": "sexual",
        "CRIMINAL TRESPASS": "minor",
        "PUBLIC PEACE VIOLATION": "minor",
        "INTERFERENCE WITH PUBLIC OFFICER": "minor",
        "KIDNAPPING": "domestic",
        "OFFENSE INVOLVING CHILDREN": "domestic",
        "STALKING": "domestic",
        "NARCOTICS": "substances",
        "LIQUOR LAW VIOLATION": "substances",
        "OTHER OFFENSE": "other",
        "WEAPONS VIOLATION": "other"
    },
    colors: {
        theft: {
            fill: 0x9C27B0,
            stroke: 0xD500F9
        },
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
        minor: {
            fill: 0x03A9F4,
            stroke: 0x40C4FF
        },
        domestic: {
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
    },
    months: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ],
    years: [
        2011,
        2012,
        2013,
        2014,
        2015,
        2016
    ],
    crimeTypes: [
        "theft",
        "property",
        "personal",
        "sexual",
        "minor",
        "domestic",
        "substances",
        "other"
    ],
    crimeIds: {
        "theft": 0,
        "property": 1,
        "personal": 2,
        "sexual": 3,
        "minor": 4,
        "domestic": 5,
        "substances": 6,
        "other": 7
    }
};
