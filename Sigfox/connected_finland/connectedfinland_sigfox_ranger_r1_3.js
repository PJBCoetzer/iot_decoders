// connectedfinland_sigfox_ranger_v1_3

'use strict';

//-------------------------------------------------------------------------------------------------------------
function parseData(data) {

    try {

        let dataObj = [];

        const buffer = hex2Bytes(data);
        //console.log(buffer);

        let buff0 = parseDecToBin(buffer[0]).padStart(8, '0');

        let Revision = buff0.substring(0, 4);
        let _Revision = parseInt(Revision, 2);

        let CyclicID = buff0.substring(4, 6);
        let _CyclicID = parseInt(CyclicID, 2);

        let _MsgCount = parseInt(buff0.substring(6, 7));
        let _MSGType = parseInt(buff0.substring(7, 8));
        //console.log(_MSGType)

        switch (_MSGType) {
            case 0:
                {
                    let buff1 = parseDecToBin(buffer[1]).padStart(8, '0');
                    let Stationarycount = buff1.substring(0, 1);
                    let Stationaryhours = buff1.substring(1, 6);
                    let Activityreport = buff1.substring(6, 7);
                    let Batteryvoltage = buff1.substring(7, 8);
                    
                    let RSSI_1 = Number(buffer[2]);

                    //buff3 -> buff8 = MacA
                    let MAC_A = '';
                    for (let c1 = 3; c1 <= 8; c1++) {
                        let str = buffer[c1].toString(16).padStart(2, '0');
                        if (c1 < 8)
                            MAC_A += str + ':';
                        else
                            MAC_A += str;
                    }
                    
                    //buff9 -> buff11 = MacC
                    let MAC_C_First3Byte = '';
                    for (let c2 = 9; c2 <= 11; c2++) {
                        var str = buffer[c2].toString(16).padStart(2, '0');
                        MAC_C_First3Byte += str + ':';
                    }

                    dataObj = {
                        MessageType: _MSGType,
                        Stationarycount: Stationarycount,
                        Stationaryhours: Stationaryhours,
                        Activityreport: Activityreport,
                        BatteryVoltage: Batteryvoltage,
                        MACAddress_A: MAC_A,
                        RSSI_A: -RSSI_1,
                        MACAddress_C: MAC_C_First3Byte
                    };

                    return dataObj;
                }
                break;

            case 1:
                {
                    let RSSI_2 = Number(buffer[1]);

                    //buff2 -> buff7 = MacB
                    let MAC_B = '';
                    for (let c1 = 2; c1 <= 7; c1++) {
                        let str = buffer[c1].toString(16).padStart(2, '0');
                        if (c1 < 7)
                            MAC_B += str + ':';
                        else
                            MAC_B += str;
                    }

                    let RSSI_3 = Number(buffer[8]);

                    //buff9 -> buff11 = MacC
                    let MAC_C_Last3Byte = '';
                    for (var c2 = 9; c2 <= 11; c2++) {
                        var str = buffer[c2].toString(16).padStart(2, '0');
                        if (c2 < 11)
                            MAC_C_Last3Byte += str + ':';
                        else
                            MAC_C_Last3Byte += str;
                    }

                    dataObj = {
                        MessageType: _MSGType,
                        MACAddress_B: MAC_B,
                        RSSI_B: -RSSI_2,
                        MACAddress_C: MAC_C_Last3Byte,
                        RSSI_C: -RSSI_3,
                    };

                    return dataObj;
                }
                break;
            }

    } catch (e) {
        console.error('error: ', e);
        return {};
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
// Parse Dec to Bin
function parseDecToBin(buffer) {
    let bin_result = parseInt(buffer).toString(2);
    return bin_result;
}

//-------------------------------------------------------------------------------------------------------------
module.exports = {
    parseData
}