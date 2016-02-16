import hub from "../datahub.js";
import crimedata from "../crimedata.js";
import constants from "../constants.js";

function sortDateRange({min, max}) {
    min = min.getTime();
    max = max.getTime();
    return {
        min: new Date(Math.min(min, max)),
        max: new Date(Math.max(min, max))
    };
}

export function filtercrimes(stopEarly) {
    let dateFilter = sortDateRange(hub.getData("date_filter"));
    let typeFilter = hub.getData("type_filter");
    
    let min = dateFilter.min.getTime(),
        max = dateFilter.max.getTime();
    
    let notLoaded = [];
    let maxYear = dateFilter.max.getFullYear();
    for (let year = dateFilter.min.getFullYear(); year < maxYear; year++) {
        if (!crimedata.hasYearLoaded(year)) {
            notLoaded.push(year);
        }
    }
    
    if (notLoaded.length > 0 && stopEarly) {
        return {
            crimes: [],
            notLoaded: notLoaded
        };
    }
    
    let crimes = crimedata.all();
    
    return {
        crimes: crimes.map(crime => {
            let epoch = crime.date.getTime();
            return {
                crime: crime,
                show: epoch >= min && epoch <= max &&
                    typeFilter[constants.typeMap[crime.primary_type]]
            };
        }),
        notLoaded: notLoaded
    };
}

export default filtercrimes;
