const convert = {
    bin2dec : s => parseInt(s, 2).toString(10),
    bin2hex : s => parseInt(s, 2).toString(16).padStart(2,"0").toUpperCase(),
    dec2bin : s => parseInt(s, 10).toString(2).padStart(8,"0").toUpperCase(),
    dec2hex : s => parseInt(s, 10).toString(16).padStart(2,"0").toUpperCase(),
    hex2bin : s => parseInt(s, 16).toString(2).padStart(8,"0").toUpperCase(),
    hex2dec : s => parseInt(s, 16).toString(10)
    };


//-------------------------------------------------------------------------------------------------------------
// Convert to ISO 8601 timestamp
function ISODateString(d) {
    function pad(n) { return n < 10 ? '0' + n : n }
    return d.getUTCFullYear() + '-'
        + pad(d.getUTCMonth() + 1) + '-'
        + pad(d.getUTCDate()) + 'T'
        + pad(d.getUTCHours()) + ':'
        + pad(d.getUTCMinutes()) + ':'
        + pad(d.getUTCSeconds()) + 'Z'
}

//------------------------------------------------------------------------------------------------------
// Reverse a string value

function reverseString(str)
{
    let reversed = "";
    for (let i = str.length - 1; i >= 0; i--) {
        reversed += str[i];
    }
    return reversed;
}

//------------------------------------------------------------------------------------------------------
// Convert value to INT
function toInteger(value) {
    value = Number(value);
    return value < 0 ? Math.ceil(value) : Math.floor(value);
}

//------------------------------------------------------------------------------------------------------
// Finds the remainder after division of one number by another
function modulo(a, b) {
    return a - Math.floor(a / b) * b;
}

//------------------------------------------------------------------------------------------------------
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

//------------------------------------------------------------------------------------------------------
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


//------------------------------------------------------------------------------------------------------
// Parse to signed byte
function parseToSignedByte(value) {
    value = (value & 127) - (value & 128);
    return value;
}

//------------------------------------------------------------------------------------------------------
// Read a 32 bit integer from the array of bytes
function parseLittleEndianInt32(buffer, offset) {
    return (buffer[offset + 3] << 24) +
        (buffer[offset + 2] << 16) +
        (buffer[offset + 1] << 8) +
        (buffer[offset]);
}

//------------------------------------------------------------------------------------------------------
// Read a 16 bit integer from the array of bytes
function parseLittleEndianInt16(buffer, offset) {
    let result = (buffer[offset + 1] << 8) + buffer[offset];
    if ((result & 0x8000) > 0)
        result = result - 0x10000;
    return result;
}

//------------------------------------------------------------------------------------------------------
// Read some bits from the array of bytes
function parseLittleEndianInt16Bits(buffer, offset, bitOffset, bitLength) {
    let temp = parseLittleEndianInt16(buffer, offset);
    temp = temp >> bitOffset;
    let mask = 0xffff >> (16 - bitLength);
    return temp & mask;
}

//------------------------------------------------------------------------------------------------------
// Convert to Unsigned 32 byte
function toUint32(value) {
    return this.modulo(this.ToInteger(value), Math.pow(2, 32));
}

//------------------------------------------------------------------------------------------------------
// Convert to Signed 32 byte
function toInt32(value) {
    let uint32 = this.ToUint32(value);
    if (uint32 >= Math.pow(2, 31)) {
        return uint32 - Math.pow(2, 32)
    } else {
        return uint32;
    }
}

//------------------------------------------------------------------------------------------------------
// Convert to Unsigned 16 byte
function toUint16(value) {
    return this.modulo(this.ToInteger(value), Math.pow(2, 16));
}

//------------------------------------------------------------------------------------------------------
// Convrt to Signed 16 byte
function toInt16(value) {
    let uint16 = this.ToUint16(value);
    if (uint16 >= Math.pow(2, 15)) {
        return uint16 - Math.pow(2, 16)
    } else {
        return uint16;
    }
}

//------------------------------------------------------------------------------------------------------
// Convrt to Unsigned 8 byte
function toUint8(value) {
    return this.modulo(this.ToInteger(value), Math.pow(2, 8));
}

//------------------------------------------------------------------------------------------------------
// Convrt to Signed 8 byte
function toInt8(value) {
    let uint8 = this.ToUint8(value);
    if (uint8 >= Math.pow(2, 7)) {
        return uint8 - Math.pow(2, 8)
    } else {
        return uint8;
    }
}

//------------------------------------------------------------------------------------------------------
// Convert minutes to seconds
function getSeconds(value) {
    return (value & 0x8000) ? this.ToUint32((value & 0x7fff)) * 60 : value;
}

//------------------------------------------------------------------------------------------------------
// Parse HEX to Ascii
function parseHexToASCII(buffer, start, end) {
    let sub_array = buffer.slice(start, end);
    let result = '';
    for (let i = 0; i < sub_array.length; i++)
        result += String.fromCharCode(sub_array[i]);
    return result;
}

//------------------------------------------------------------------------------------------------------
// Parse Dec to Hex
function parseDecToHex(buffer) {
    let hex_result = '';
    buffer.forEach(element => {
        hex_result += element.toString(16);
    });
    return hex_result;
}

//------------------------------------------------------------------------------------------------------
// Parse Dec to Bin
function parseDecToBin(buffer) {
    let bin_result = parseInt(buffer).toString(2);
    return bin_result;
}

//------------------------------------------------------------------------------------------------------
// Parse Slice to Int
function parseSliceInt(value, start, length) {
    let binary = parseDecToBin(parseInt(value).toString(2)).padStart(8, "0").slice(start, start + length);
    if (binary.includes("1")) {
        return parseInt(binary, 2);
    }
    return 0;
}

//------------------------------------------------------------------------------------------------------
// Parse Slice Int16
function parseSliceInt16(value, start, length) {
    let binary = parseDecToBin(parseInt(value).toString(2)).padStart(16, "0").slice(start, start + length);
    if (binary.includes("1")) {
        return parseInt(binary, 2);
    }
    return 0;
}



//------------------------------------------------------------------------------------------------------
//IEEE754 coded
function toIEEE32BitFloat(n) {

    n = +n;
    let res;
    let mts = n & 0x007fffff;
    let sgn = (n & 0x80000000) ? -1 : 1;
    let exp = (n & 0x7f800000) >>> 23;

    function mantissa(mts) {
        let bit = 0x00400000;
        while (mts && bit) {
            mts /= 2;
            bit >>>= 1;
        }
        return mts;
    }

    if (exp === 0xff) {
        //NaN or +/- Infinity
        res = mts ? NaN : sgn * Infinity;
    }
    else {
        if (exp) {
            //Normalized value
            res = sgn * ((1 + mantissa(mts)) * Math.pow(2, exp - 127));
        }
        else {
            if (mts) {
                //Subnormal
                res = sgn * (mantissa(mts) * Math.pow(2, -126));
            }
            else {
                //zero, -zero
                res = (sgn > 0) ? 0 : -0;
            }
        }
    }

    return res;
}


//------------------------------------------------------------------------------------------------------
// export functions
module.exports = {
    convert,
    ISODateString,
    reverseString,
    toInteger,
    modulo,
    isHex,
    getBase64,
    hex2Bytes,
    parseLittleEndianInt32,
    parseLittleEndianInt16,
    parseLittleEndianInt16Bits,
    parseToSignedByte,
    toUint32,
    toInt32,
    toUint16,
    toInt16,
    toUint8,
    toInt8,
    getSeconds,
    parseHexToASCII,
    parseDecToHex,
    parseDecToBin,
    parseSliceInt,
    parseSliceInt16,
    toIEEE32BitFloat
}