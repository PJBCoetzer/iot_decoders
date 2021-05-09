// rts_sigfox_magneticpickup_type6_old

'use strict';

//-------------------------------------------------------------------------------------------------------------
function parseData(data) {
    let buffer = hex2Bytes(data);
    let txFlags = buffer[0];
    let magnetValue = buffer[1];    //0 = No magnet         1 = Magnet Present
    let magnetRaw = buffer[2];      //1 = Magnet removed    0 = Magnet present
    let batteryRaw = buffer[3];
    let rtx = parseLittleEndianInt32(buffer, 4);

    let messageType = 1;

    if (buffer[0] & 1) messageType = 1 // Interval
    if (buffer[0] & 2) messageType = 1 // Interval
    if (buffer[0] & 4) messageType = 5 // Warning/Alert
    if (buffer[0] & 8) messageType = 5 // Warning/Alert
    if (buffer[0] & 16) messageType = 2 // Heartbeat       
    if (buffer[0] & 32) messageType = 2 // Heartbeat
    if (buffer[0] & 64) messageType = 2 // Heartbeat

    //old version needs the magnet value switched
    magnetValue == 1 ? magnetValue = 0 : magnetValue = 1

    let datObj = {
        TxFlags: txFlags,
        MagnetPresent: magnetValue,
        MagnetInfo: magnetRaw,
        Rtx: rtx,
        BatteryVoltage: (batteryRaw * 0.0200),
        MessageType: messageType
    };

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
// Read a 32 bit integer from the array of bytes
function parseLittleEndianInt32(buffer, offset) {
    return (buffer[offset + 3] << 24) +
        (buffer[offset + 2] << 16) +
        (buffer[offset + 1] << 8) +
        (buffer[offset]);
}

//-------------------------------------------------------------------------------------------------------------
module.exports = {
    parseData
}