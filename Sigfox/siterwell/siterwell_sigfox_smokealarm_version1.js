// siterwell_sigfox_smokealarm_version1

'use strict';


//----------------------------------------------------------------------------------------------------------------
function parseData(data) {

    let alarm = 0,
        alert = 0;
    data = data.trim().toUpperCase();

    if (data == 'F7' || data == 'F8') {
        alarm = 1;
        alert = 0;
    } else if (data == 'F2' || data == 'F4' || data == 'F6') {
        alarm = 0;
        alert = 1;
    }

    let datObj = {
        alarm: alarm,
        alert: alert,
        low_battery: (data == 'F2' ? 1 : 0),
        heat: (data == 'F7' ? 1 : 0),
        smoke: (data == 'F8' ? 1 : 0),
        test: (data == 'F1' ? 1 : 0)
    };

    return datObj;

}


//-------------------------------------------------------------------------------------------------------------
module.exports = {
    parseData
}