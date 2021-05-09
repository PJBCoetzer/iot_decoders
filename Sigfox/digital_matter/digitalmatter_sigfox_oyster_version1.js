// digitalmatter_sigfox_oyster_version1

'use strict';

//------------------------------------------------------------------------------------------------------------
function parseData(buffer) {

    let val = buffer.trim();
    let bytes;

    if (isHex(val))
        bytes = hex2Bytes(val);
    else
        bytes = getBase64(val);

    let object = parseSigFox(bytes);
    if (object == null)
        return "Invalid payload";
    else
        return object;

}

function parseSigFox(buffer) {
    if (buffer == null)
        return null;

    if (buffer.length != 12)
        return null;

    let recordType = buffer[0] & 0x0f;

    switch (recordType) {
        case 0: //positional data
            return parsePositionalData(buffer);

        case 1: //downlink ACK
            return parseDownlinkAck(buffer);

        case 2: //device data
            return parseDeviceStats(buffer);

        case 3: //extended positional data
            return parseExtendedData(buffer);

        default:
            return null;
    }
}

//Msg Type: 0
function parsePositionalData(buffer) {
    let flags = buffer[0] & 0xF0;
    let inTrip = (flags & 0x10) > 0;
    let lastFixFailed = (flags & 0x20) > 0;

    let latitudeRaw = parseLittleEndianInt32(buffer, 1);
    let longitudeRaw = parseLittleEndianInt32(buffer, 5);
    let headingRaw = buffer[9];
    let speedRaw = buffer[10];
    let batteryRaw = buffer[11];

    return {
        MessageType: 0,
        InTrip: inTrip,
        LastFixFailed: lastFixFailed,
        Latitude: latitudeRaw * 1e-7,
        Longitude: longitudeRaw * 1e-7,
        Heading: headingRaw * 2,
        SpeedKmH: speedRaw,
        BatteryVoltage: (batteryRaw * 25) / 1000.0
    };
}

//Msg Type: 1
function parseDownlinkAck(buffer) {
    let flags = buffer[0] & 0xF0;
    let downlinkAccepted = (flags & 0x10) > 0;

    let firmwareMajor = buffer[2];
    let firmwareMinor = buffer[3];

    let data = [];
    for (let i = 0; i < 8; i++) {
        data.push(i + 4);
    }

    return {
        MessageType: 1,
        DownlinkAccepted: downlinkAccepted,
        FirmwareVersion: firmwareMajor + '.' + firmwareMinor,
        DownlinkData: data
    };
}

//Msg Type: 2 
function parseDeviceStats(buffer) {
    let uptimeWeeks = parseLittleEndianInt16Bits(buffer, 0, 4, 9 /*bits*/ );
    let txCountRaw = parseLittleEndianInt16Bits(buffer, 1, 5, 11 /*bits*/ );
    let rxCountRaw = buffer[3];
    let tripCountRaw = parseLittleEndianInt16Bits(buffer, 4, 0, 13 /*bits*/ );
    let gpsSuccessRaw = parseLittleEndianInt16Bits(buffer, 5, 5, 10 /*bits*/ );
    let gpsFailuresRaw = parseLittleEndianInt16Bits(buffer, 6, 7, 8 /*bits*/ );
    let averageFixTime = parseLittleEndianInt16Bits(buffer, 7, 7, 9 /*bits*/ );
    let averageFailTime = parseLittleEndianInt16Bits(buffer, 9, 0, 9 /*bits*/ );
    let averageFreshenTime = parseLittleEndianInt16Bits(buffer, 10, 1, 8 /*bits*/ );
    let wakeupsPerTrip = buffer[11] >> 1;

    return {
        MessageType: 2,
        UptimeWeeks: uptimeWeeks,
        TxCount: txCountRaw * 32,
        RxCount: rxCountRaw * 32,
        TripCount: tripCountRaw * 32,
        GpsSuccessCount: gpsSuccessRaw * 32,
        GpsFailureCount: gpsFailuresRaw * 32,
        AverageFixTimeSeconds: averageFixTime,
        AverageFailTimeSeconds: averageFailTime,
        AverageFreshenTimeSeconds: averageFreshenTime,
        WakeUpsPerTrip: wakeupsPerTrip
    };
}

//msg type 3
function parseExtendedData(buffer) {
    let headingRaw = buffer[0] >> 4;
    let latitudeRaw = buffer[1] + buffer[2] * 256 + buffer[3] * 65536;
    if (latitudeRaw >= 0x800000) // 2^23
        latitudeRaw -= 0x1000000; // 2^24
    let longitudeRaw = buffer[4] + buffer[5] * 256 + buffer[6] * 65536;
    if (longitudeRaw >= 0x800000) // 2^23
        longitudeRaw -= 0x1000000; // 2^24
    let posAccRaw = buffer[7];
    let batteryRaw = buffer[8];
    let speedRaw = buffer[9] & 0x3F;
    let inTrip = (buffer[9] & 0x40) > 0;
    let lastFixFailed = (buffer[9] & 0x80) > 0;

    return {
        MessageType: 3,
        Heading: headingRaw * 22.5,
        Latitude: (latitudeRaw * 256) / 1e7,
        Longitude: (longitudeRaw * 256) / 1e7,
        PosAccM: posAccRaw * 1,
        BatteryVoltage: (batteryRaw * 25) / 1000.0,
        SpeedKmH: speedRaw * 2.5,
        InTrip: inTrip,
        LastFixFailed: lastFixFailed
    };
}


//-------------------------------------------------------------------------------------------------------------
// Check if value is a HEX formatted value
function isHex(value) {
    if (value.length == 0) return false;
    if (value.startsWith('0x') || value.startsWith('0X')) {
        value = value.substring(2);
    }
    let reg_exp = /^[0-9a-fA-F]+$/;
    if (reg_exp.test(value) && value.length % 2 == 0) {
        return true;
    } else {
        return false;
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

//-------------------------------------------------------------------------------------------------------------
// Read some bits from the array of bytes
function parseLittleEndianInt16Bits(buffer, offset, bitOffset, bitLength) {
    let temp = parseLittleEndianInt16(buffer, offset);
    temp = temp >> bitOffset;
    let mask = 0xffff >> (16 - bitLength);
    return temp & mask;
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
function getBase64(input) {
    let keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let output = new Array();
    let chr1, chr2, chr3;
    let enc1, enc2, enc3, enc4;
    let i = 0;

    let orig_input = input;
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    if (orig_input != input)
        return null;

    if (input.length % 4)
        return null;

    let j = 0;
    while (i < input.length) {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output[j++] = chr1;
        if (enc3 != 64)
            output[j++] = chr2;
        if (enc4 != 64)
            output[j++] = chr3;
    }

    return output;
}

//-------------------------------------------------------------------------------------------------------------
module.exports = {
    parseData
}