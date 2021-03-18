require("dotenv").config();

const cacheManager = require('cache-manager');
const redisStore = require('cache-manager-ioredis');
const fsStore = require('cache-manager-fs-hash');
const memcachedStore = require('cache-manager-memcached-store');

function caching_options() {
    const cache_store_env = process.env.CACHE_STORE;
    if (cache_store_env === 'redis') {
        // configuration from .env for redis connection
        return {
            store: redisStore,
            host: process.env.CACHE_REDIS_HOST ? process.env.CACHE_REDIS_HOST : 'localhost', //default host value
            port: process.env.CACHE_REDIS_PORT ? process.env.CACHE_REDIS_PORT : 6379, // default value
            db: process.env.CACHE_REDIS_DATABASE ? process.env.CACHE_REDIS_DATABASE : 0, //
            ttl: process.env.CACHE_TTL ? process.env.CACHE_TTL : 60,  //time to life in seconds
        }
    } else if (cache_store_env === 'memcache') {
        return {
            store: memcachedStore,
            options: {
                hosts: ['127.0.0.1:11211'],
                ttl: process.env.CACHE_TTL ? process.env.CACHE_TTL : 60,
            }
        }
    } else {
        return {
            store: fsStore,
            options: {
                path: process.env.CACHE_FILE_PATH ? process.env.CACHE_FILE_PATH : 'cachedData',  //path for cached files
                ttl: process.env.CACHE_TTL ? process.env.CACHE_TTL : 60,    //time to life in seconds
                subdirs: process.env.CACHE_FILE_SUBDIRS ? process.env.CACHE_FILE_SUBDIRS : true,  //create subdirectories to reduce the 
                //files in a single dir (default: false)
            }
        }
    }
}

let cache = cacheManager.caching(caching_options());

module.exports = cache;
