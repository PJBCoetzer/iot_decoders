// connectedfinland_sigfox_detectify_r3

'use strict';

//-------------------------------------------------------------------------------------------------------------
function parseData(data) {


    let buffer = hex2Bytes(data);
    let bin_result = buffer[0].toString(2).padStart(8, '0');
    let state = parseInt(bin_result[6]);

    let datObj = {
        pirstate: state
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