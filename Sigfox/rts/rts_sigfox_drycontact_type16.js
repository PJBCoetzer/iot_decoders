// rts_sigfox_drycontact_type16

'use strict';

//-------------------------------------------------------------------------------------------------------------

let DryContactTxFlags = {
    'PowerUp': 1,
    'ForcedTransmit': 2,
    'DigitalChange': 4,
    'LevelChange': 8,
    'PeriodicUpdate': 16,
    'TxUpdateTimer1': 32,
    'TxUpdateTimer2': 64,
    'TxUpdateTimer3': 128
};
let DryContactStatus = {
    'Digital1Present': 1,
    'Digital2Present': 2,
    'Level1Present': 4,
    'Level2Present': 8,
    'Level3Present': 16,
    'Level4Present': 32
};
let DryContactTxInfo = {
    'PowerUp': 1,
    'ForcedTransmit': 2,
    'Digital1HighAlert': 4,
    'Digital1LowAlert': 8,
    'Digital2HighAlert': 16,
    'Digital2LowAlert': 32,
    'Level1HighAlert': 64,
    'Level1LowAlert': 128,
    'Level2HighAlert': 256,
    'Level2LowAlert': 512,
    'Level3HighAlert': 1024,
    'Level3LowAlert': 2048,
    'Level4HighAlert': 4096,
    'Level4LowAlert': 8192
};
let DryContactUpdateInterval = {
    'hour1': 0,
    'hour2': 1,
    'hour4': 2,
    'hour8': 3,
    'hour12': 4,
    'hour16': 5,
    'hour20': 6,
    'hour24': 7
};


function parseData(data) {

    let digital1Present = 0;
    let digital2Present = 0;
    let digital1Error = 0;
    let digital2Error = 0;
    let txInfo = 0;

    let buffer = hex2Bytes(data);
    if (!buffer) {
        return null;
    }

    let txFlags = buffer[0];
    let batteryRaw = buffer[1];
    let BatteryVoltage = (batteryRaw * 0.0200);
    let Status = buffer[2];

    let messageType = 1;
    if (buffer[0] & 1) messageType = 1 // Interval
    if (buffer[0] & 2) messageType = 5 // Interval
    if (buffer[0] & 4) messageType = 5 // Digital Warning/Alert
    if (buffer[0] & 8) messageType = 5 // Level Warning/Alert
    if (buffer[0] & 16) messageType = 2 // Heartbeat       
    if (buffer[0] & 32) messageType = 2 // Heartbeat
    if (buffer[0] & 64) messageType = 2 // Heartbeat
    if (buffer[0] & 128) messageType = 2 // Heartbeat


    if ((buffer[0] & 4) || (buffer[0] & 8)) //Digital or Level has changed
    {
        //Get Digital Status
        if (buffer[2] & 1) digital1Present = 1
        if (buffer[2] & 2) digital2Present = 1

        //use txInfo for Error Status
        txInfo = buffer[5] + buffer[6];

        //if (txInfo & 1) //Power Up
        //if (txInfo & 2) //Forced Transmit
        //if (txInfo & 4) //Digital 1 high alert
        if (txInfo & 8) digital1Error = 1 // Digital 1 low alert
        //if (txInfo & 16) //Digital 2 high alert       
        if (txInfo & 32) digital2Error = 1 // Digital 2 low alert
        //if (txInfo & 64)//Level 1 high alert
        //if (txInfo & 128) //Level 1 low alert
        //if (txInfo & 256) /Level 2 high alert
        //if (txInfo & 512) //Level 2 low alert
        //if (txInfo & 1024) /Level 3 high alert
        //if (txInfo & 2048) /Level 3 low alert
        //if (txInfo & 4096) //Level 4 high alert
        //if (txInfo & 8192) //Level 4 low alert

    }

    let datObj = {
        TxFlags: txFlags,
        TxInfo: txInfo,
        Status: Status,
        BatteryVoltage: BatteryVoltage,
        Digital1Present: digital1Present,
        Digital2Present: digital2Present,
        Digital1Error: digital1Error,
        Digital2Error: digital2Error,
        MessageType: messageType
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