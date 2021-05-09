// iotcompany_sigfox_climator_version1

'use strict';

//----------------------------------------------------------------------------------------------------------------
function parseData(buffer) {

    try {

        const MSGType = buffer.substring(0, 2);
        let dataBytes = hex2Bytes(buffer.substring(2));

        switch (MSGType) {

            //Bat Message
            case '40':
                let batteryRaw = dataBytes[1] & 0xff;
                let objBat = {
                    MessageType: MSGType,
                    BatteryVoltage: (batteryRaw / 50)
                };
                return objBat;
                break;

            //Data Message
            case '50':
                let temperature = parseLittleEndianInt16(dataBytes, 0);
                temperature = (temperature & 0xffff) / 256.0

                let humidity = dataBytes[2] & 0xff;
                humidity = humidity / 2.55;

                let pirmagnitude = dataBytes[4];
                pirmagnitude = dataBytes[3] * 4

                let co2 = parseLittleEndianInt16(dataBytes, 4);
                co2 = co2 & 0xffff;

                let light = parseLittleEndianInt16(dataBytes, 6);
                let mantissa = light & 0xfff;
                let exponent = light >> 12;
                light = (mantissa * (1 << exponent) / 100.0);


                let x = dataBytes[8] / 64.0;
                let y = dataBytes[9] / 64.0;
                let z = dataBytes[10] / 64.0;

                let objData = {
                    MessageType: MSGType,
                    Temperature: temperature,
                    Humidity: humidity,
                    PIRMagnitude: pirmagnitude,
                    Co2: co2,
                    Light: light,
                    Accelerometer_X: x,
                    Accelerometer_Y: y,
                    Accelerometer_Z: z
                };
                return objData;
                break;
        }

    } catch (error) {
        console.error(error);
        return {
            'error:': error
        };
    }

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

//------------------------------------------------------------------------------------------------------
// Read a 16 bit integer from the array of bytes
function parseLittleEndianInt16(buffer, offset) {
    let result = (buffer[offset + 1] << 8) + buffer[offset];
    if ((result & 0x8000) > 0)
        result = result - 0x10000;
    return result;
}

//-------------------------------------------------------------------------------------------------------------
module.exports = {
    parseData
}