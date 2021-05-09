// unabiz_sigfox_unasensors_sense

'use strict';

//----------------------------------------------------------------------------------------------------------------

function parseData(data) {

    let buffer = hex2Bytes(data);
    let datObj;

    if (buffer[0] == 0x01) {
        datObj = {
            MessageType: buffer[0],
            temperature: parseTemperature((buffer[2] << 8) + buffer[3]),
            temperature_2: parseTemperature((buffer[4] << 8) + buffer[5]),
            humidity: ((buffer[6] << 8) + buffer[7]) / 100,
            humidity_2: ((buffer[8] << 8) + buffer[9]) / 100,
            interval: buffer[1]
        }
    } else if (buffer[0] == 0x02) {

        let trigger = 1

        if (buffer[5] & 0x08) trigger = 1;
        if (buffer[5] & 0x04) trigger = 2;
        if (buffer[5] & 0x02) trigger = 3;
        if (buffer[5] & 0x01) trigger = 4;

        datObj = {
            MessageType: buffer[0],
            temperature: parseTemperature((buffer[1] << 8) + buffer[2]),
            humidity: ((buffer[3] << 8) + buffer[4]) / 100,
            trigger: trigger
        }
    }
    return datObj;

}

//-------------------------------------------------------------------------------------------------------------
//Temp conversion
function parseTemperature(hexTemp) {
    let a = hexTemp;
    if ((a & 0x8000) > 0) {
        a = a - 0x10000;
    }
    return (a / 100)
}

//-------------------------------------------------------------------------------------------------------------
// Parse Hex to Bytes
function hex2Bytes(value) {

    if (!value) { return []; }
    if (value.startsWith('0x') || value.startsWith('0X')) {
        value = value.substring(2);     //get rid of starting '0x'
    }
    let num_bytes = value.length / 2;
    let bytes = [];
    for (let i = 0; i < num_bytes; i++) {
        bytes.push(parseInt(value.substring(i * 2, (i * 2) + 2), 16));
    }
    return bytes;
}

//-------------------------------------------------------------------------------------------------------------
module.exports = {
    parseData
}