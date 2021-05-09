// rts_sigfox_icelocatepowerusb_type15

'use strict';


//-------------------------------------------------------------------------------------------------------------

function parseData(data) {

    var buffer = hex2Bytes(data);

    var txFlags = buffer[0];

    let messageType = 1;
    let powerStatus = 0;
    let highTempStatus = 0;
    let lowTempStatus = 0;

    if (buffer[0] & 1) messageType = 1 // Power Up
    if (buffer[0] & 2) messageType = 1 // Forced transmit
    if (buffer[0] & 4) messageType = 5 // Power Alert
    if (buffer[0] & 8) messageType = 5 // Temp Alert
    if (buffer[0] & 16) messageType = 2 // Heartbeat 

    var batteryRaw = buffer[1];
    var status = buffer[2];

    if (buffer[2] & 1) powerStatus = (buffer[2] & 1) // Power Present
    if (buffer[2] & 2) highTempStatus = (buffer[2] & 2) // High Tenmp Alert
    if (buffer[2] & 4) lowTempStatus = (buffer[2] & 4) // Low Temp Alert

    //according to doc if power status = 0 power is present, else no power present
    powerStatus = (powerStatus === 0) ? 1 : 0;

    var temp = buffer[3];
    //to convert to signed byte
    temp = (temp & 127) - (temp & 128);
    var txinfo = buffer[4];

    var datObj = {
        TxFlags: txFlags,
        BatteryVoltage: (batteryRaw * 0.0200),
        Status: status,
        Temperature: temp,
        Txinfo: txinfo,
        MessageType: messageType,
        PowerStatus: powerStatus,
        HighTempStatus: highTempStatus,
        LowTempStatus: lowTempStatus
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
module.exports = {
    parseData
}