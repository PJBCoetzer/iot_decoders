// connectedfinland_sigfox_airwits_r1

'use strict';

//----------------------------------------------------------------------------------------------------------------
function parseData(buffer) {

    let temperature = parseInt('0x' + buffer.substring(0, 4)) / 10 - 40;
    let humidity = parseInt('0x' + buffer.substring(4, 6));
    let co2 = parseInt('0x' + buffer.substring(7, 10));
    let datObj = {
        temperature: temperature,
        humidity: humidity,
        co2: co2
    };

    return datObj;
}

//----------------------------------------------------------------------------------------------------------------
module.exports = {
    parseData
}

