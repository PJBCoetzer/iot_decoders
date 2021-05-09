// inducon_sigfox_microsense_version2

'use strict';

//-------------------------------------------------------------------------------------------------------------
function parseData(data) {

    let recordType = microsense_GetMessageType(data);
    switch (recordType) {
        case "08": 
            return parseMicrosenseStreamData08(data);
        case "06": 
            return parseMicrosenseStreamData06(data);
        default:
            return null;
    }

}

function microsense_GetMessageType(data) {
    return data.substring(0, 2);
}

function parseMicrosenseStreamData08(data) {
    let mbar = microsense_mBarValue(data);
    let udate = microsense_unixDateValue(data);
    let watermt = microsense_meterwater(data);

    let datObj = {
        message_type_id: 1,
        message_timestamp: udate,
        data_barometric_hpa: mbar,
        data_water_level: watermt 
    }
    return datObj;
}

function parseMicrosenseStreamData06(data) {

    let valTimestamp = data.substring(6, 14);
    valTimestamp = parseInt(valTimestamp, 16);
    valTimestamp = microsense_Unix_timestamp(valTimestamp);

    let valBat = data.substring(2, 6);
    valBat = parseInt(valBat, 16);
    valBat = valBat / 1000;

    let datObj = {
        message_type_id: 2,
        message_timestamp: valTimestamp,
        data_battery_voltage: valBat
    }
    return datObj;
}

function microsense_mBarValue(data) {
    let val1 = data.substring(2, 6);
    val1 = parseInt(val1, 16);
    val1 = val1 / 20;
    return val1;
}

function microsense_meterwater(data) {
    let val3 = data.substring(14, 22);
    let hexrep = "0x";
    let res = hexrep.concat(val3);
    return toIEEE32BitFloat(res);
}

function microsense_unixDateValue(data) {
    let val2 = data.substring(6, 14);
    val2 = parseInt(val2, 16);
    val2 = microsense_Unix_timestamp(val2);
    return val2;
}

function microsense_Unix_timestamp(t) {
    let dt = new Date(t * 1000);
    let isodateTime = ISODateString(dt);
    return isodateTime;
}

//-------------------------------------------------------------------------------------------------------------
// Convert to ISO 8601 timestamp
function ISODateString(d) {
    function pad(n) { return n < 10 ? '0' + n : n }
    return d.getUTCFullYear() + '-'
        + pad(d.getUTCMonth() + 1) + '-'
        + pad(d.getUTCDate()) + 'T'
        + pad(d.getUTCHours()) + ':'
        + pad(d.getUTCMinutes()) + ':'
        + pad(d.getUTCSeconds()) + 'Z'
}

//-------------------------------------------------------------------------------------------------------------
//IEEE754 coded
function toIEEE32BitFloat(n) {

    n = +n;
    let res;
    let mts = n & 0x007fffff;
    let sgn = (n & 0x80000000) ? -1 : 1;
    let exp = (n & 0x7f800000) >>> 23;

    function mantissa(mts) {
        let bit = 0x00400000;
        while (mts && bit) {
            mts /= 2;
            bit >>>= 1;
        }
        return mts;
    }

    if (exp === 0xff) {
        //NaN or +/- Infinity
        res = mts ? NaN : sgn * Infinity;
    }
    else {
        if (exp) {
            //Normalized value
            res = sgn * ((1 + mantissa(mts)) * Math.pow(2, exp - 127));
        }
        else {
            if (mts) {
                //Subnormal
                res = sgn * (mantissa(mts) * Math.pow(2, -126));
            }
            else {
                //zero, -zero
                res = (sgn > 0) ? 0 : -0;
            }
        }
    }

    return res;
}


//-------------------------------------------------------------------------------------------------------------
module.exports = {
    parseData
}