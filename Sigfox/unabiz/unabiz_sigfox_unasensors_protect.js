// unabiz_sigfox_unasensors_protect


'use strict';

//-------------------------------------------------------------------------------------------------------------
function parseData(data) {

    let buffer = hex2Bytes(data);
    let datObj;

    if (buffer[0] == 0x01) {
        datObj = {
            MessageType: buffer[0],
            interval: buffer[1],
            activity_01: buffer[3],
            activity_02: buffer[4],
            activity_03: buffer[5],
            activity_04: buffer[6],
            activity_05: buffer[7],
            activity_06: buffer[8],
            activity_07: buffer[9],
            activity_08: buffer[10],
            activity_09: buffer[11],
            activity_10: buffer[12],
        }
    } else if (buffer[0] == 0x02) {
        datObj = {
            MessageType: buffer[0],
            state: buffer[1]
        }
    } else if (buffer[0] == 0x04) {
        datObj = {
            MessageType: buffer[0],
            battery_voltage: ((buffer[1] << 8) + (buffer[1])) / 1000,
            mode: buffer[3],
            interval: buffer[4],
        }
    }

    return datObj;
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