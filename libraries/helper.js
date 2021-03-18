/**
 * helper function for data
 */
let helperFunctions = {
    /**
     * Pushing data into array
     * 
     * @param {Array} mainArray array in which we need top push data
     * @param {Array} subArray array of data which need to push
     * @param {string} matchedColumn name of column that we need to match
     * @param {string} ResponsePushName name of response array that need to push
     */
    subToMainPushArray: async (mainArray, subArray, matchedColumn = 'id', ResponsePushName = 'data') => {

        // loop the main array data to create and push
        for (let i = 0; i < mainArray.length; i++) {

            // push blank array by name
            mainArray[i][ResponsePushName] = [];

            // loop the sub array data to check and push
            for (let j = 0; j < subArray.length; j++) {

                // condition to check if the main array id match with sub array id
                if (mainArray[i].id === subArray[j][matchedColumn]) {

                    // if true then push the data into array
                    mainArray[i][ResponsePushName].push(subArray[j])
                }
            }
        }

        // return builded array
        return await mainArray;
    },

    /**
     * Create string to insert bulk data into mysql database
     * 
     * @param {string} string_of_ids string of ids sent
     * @param {number} single_id single id that will make combination with string of ids
     * @param {string} before decide which comes first 'single' or 'string_of_ids'
     */
    bulkInsrtString: async (string_of_ids, single_id, before = 'single') => {
        // convert string to array
        var array_of_ids = string_of_ids.split(",");

        // make a combined array.
        let combined_array = [];

        // check the lenght of array
        if (array_of_ids.length <= 0) {
            return ''
        }

        // loop through the array of ids to insert single id
        for (var i = 0; i < array_of_ids.length; i++) {
            // which come first
            if (before === 'single') {
                combined_array.push('(' + single_id + ',' + array_of_ids[i] + ')');
            } else if (before === 'string_of_ids') {
                combined_array.push('(' + array_of_ids[i] + ',' + single_id + ')');
            }
        }
        // return data
        return await combined_array.join();
    },


}

// export
module.exports = helperFunctions;
