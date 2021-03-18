/**
 * base url API
 */
const constants = require('./../../config/constants');
const logger = require('./../../config/winstonConfig');
require('dotenv').config();
const _ = require('lodash');
const helper = require('./../../libraries/helper');
const categoriesModel = require('./../../models/categoriesModel');
const jwtHelper = require('./../../libraries/jwtHelper');
const cacheHelper = require('./../../libraries/cacheHelper');
//import * as notiicationsHelper from "./../../libraries/notificationHelper";

/**
 * Expample async/await for making API with eager loading
 * @param {*} req sequeste handle by express
 * @param {*} res response handle by express
 */
const categoriesWithSubcategories = async (req, res) => {

    // get cache Data and check if exist then return
    var cacheData = await cacheHelper.getCache('majorIdsCache');
    if (cacheData) {
        console.log('else, else, else, else')
        // if cache data found then retrun cache data 
        return res.json(cacheData);
    }

    // make data and send response 
    let major_ids = '1,2,3,4,5,6,7,8,9';
    let student_id = 3;
    const bulkIdsResult = await helper.bulkInsrtString(major_ids, student_id, 'single');
    cacheHelper.setCache('majorIdsCache', bulkIdsResult, 10);
    return await res.json(bulkIdsResult);
}

module.exports = categoriesWithSubcategories;
