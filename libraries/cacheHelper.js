require("dotenv").config();
const cacheManager = require('./../config/cache');

const cacheHelper = {
    /**
     * Method to set cache into databse
     * 
     * @param {string} key unique name of key for cache
     * @param {JSON} value json value that you want to save 
     * @param {number} ttl array of data which need to push default set form .env file
     */
    setCache: async (key, value, ttl = process.env.CACHE_TTL ? process.env.CACHE_TTL : 3000) => {
        return await cacheManager.set(key, value, { ttl: ttl });
    },

    /**
     * get cache data from datbase
     * 
     * @param {string} key unique name of key for cache
     */
    getCache: async (key) => {
        return await cacheManager.get(key);
    },

    /**
     * delete cache from database
     * 
     * @param {string} key unique name of key for cache
     */
    deleteCache: async (key) => {
        return await cacheManager.del(key, (err) => {
            if (err) {
                throw err;
            }
            return result;
        });
    }
}

// export module pool to be used in other files
module.exports = cacheHelper;
