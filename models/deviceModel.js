const dbConnection = require('./../config/connection');
const logger = require('./../config/winstonConfig')

/**
 * A model for intration with databse for device model
 */
const deviceModel = {

    /**
     * get devices from databsase
     */
    getDevices: async (query_data) => {
        // to get all devies form database query
        const query = "SELECT * FROM user_device_info WHERE user_id = :user_id AND token = :token";

        // get data
        return await dbConnection.query(query, {
            type: dbConnection.QueryTypes.SELECT,
            replacements: query_data,
        }).then(async (result) => {
            return await result;
        }).catch(async (err) => {
            logger.log('error', 'DB error: deviceModel.geDevices.getDevice.getDeviceQuery failed.', err);
            return await 'result_failed';
        });
    }
}

// export data to use in other files
module.exports = deviceModel;
