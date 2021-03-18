const logger = require('./../config/winstonConfig');
const FCM = require('./../config/fcmConfig');

/**
 * Notification helper class to send notifications
 */
const notifications = {
    /**
     * To send notification to single user.
     * @param {JSON} message unique name of key for cache
     * @param {string} user_count single or multiple, default single
     * @param {string} topic topic name or no_topic, no_topic is default
     * @param {array} device device type android, ios, web or multiple
     */
    sendNormalNotification: async (message) => {
        try {
            // send notifications
            return await FCM.send(message, async (err, response) => {
                if (err) {
                    logger.log('info', 'Failed to send notifocation.', err);
                    return 'notification_failed';
                }
                return response;
            });
        } catch (err) {
            logger.log('info', 'try_catch: Failed to send notifocation.', err);
            return 'notification_failed';
        }
    },

    /**
     * To subscribe given notification ids to given topic.
     * @param {array} tokens notification ids of users registered
     * @param {string} topic_name name of the topic of the user
     */
    subscribeUserToTopic: async (tokens, topic_name) => {
        try {
            return await FCM.subscribeToTopic(tokens, topic_name, async (err, response) => {
                if (err) {
                    logger.log('info', 'Failed to subscribe users notifocation ids to topic: "' + topic_name + '".', err);
                    return 'subscribe_failed';
                }
                return response;
            });
        } catch (err) {
            logger.log('info', 'try_catch: Failed to subscribe users notification ids.', err);
            return 'subscribe_failed';
        }
    },

    /**
     * To unsubscribe given notification ids form given topic.
     * @param {array} tokens notification ids of users registered
     * @param {string} topic_name name of the topic of the user
     */
    unsubscribeUserToTopic: async (tokens, topic_name) => {
        try {
            return await FCM.unsubscribeFromTopic(tokens, topic_name, async (err, response) => {
                if (err) {
                    logger.log('info', 'Failed to unsubscribe users notifocation ids to topic: "' + topic_name + '".', err);
                    return 'unsubscribe_failed';
                }
                return response;
            });
        } catch (err) {
            logger.log('info', 'try_catch: Failed to unsubscribe users notification ids.', err);
            return 'unsubscribe_failed';
        }
    },

    /**
     * Send notification to all subscribers of topic.
     * @param {array} tokens notification ids of users registered
     * @param {string} topic_name name of the topic of the user
     */
    sendNotificationToTopic: async (message, topic) => {
        message.topic = topic;
        try {
            FCM.send(message, (err, response) => {
                if (err) {
                    logger.log('info', 'Failed to send notification to topic: "' + topic_name + '".', err);
                    return 'topic_notification_failed';
                }
                return response;
            });
        } catch (err) {
            logger.log('info', 'try_catch: Failed to send notificiaton to topic "' + topic_name + '".', err);
            return 'topic_notification_failed';
        }
    },
}

// export this module to use in other files
module.exports = notifications;