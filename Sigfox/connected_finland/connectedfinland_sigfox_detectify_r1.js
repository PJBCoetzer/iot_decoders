// connectedfinland_sigfox_detectify_r1

'use strict';

//-------------------------------------------------------------------------------------------------------------
function parseData(buffer) {

    let state = (buffer === 'ff') ? 1 : 0;
    
    var datObj = {
        pirstate: state
    };

    return datObj;

}


//-------------------------------------------------------------------------------------------------------------
module.exports = {
    parseData
}