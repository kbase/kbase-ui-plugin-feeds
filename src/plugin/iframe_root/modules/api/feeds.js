define([
    './restClient'
], function(
    RestClient
) {
    'use strict';
    /**
     * Basic feeds API.
     */

    /**
     * Instantiates the Feeds API. Requires both the endpoint (i.e. https://kbase.us/services/feeds)
     * and a valid KBase Auth token. The token is NOT validated before use.
     * @param {string} endpoint - the endpoint for the Feeds service
     * @param {string} token - the user's auth token
     */
    class FeedsAPI extends RestClient {
        constructor(endpoint, token) {
            super(endpoint, token);
        }
        /**
         * Returns the list of notifications for a single user.
         * @param {object} options
         *  - reverseSort - boolean
         *  - verb - string or int
         *  - level - string or int
         *  - includeSeen - boolean
         */
        getNotifications(options) {
            let params = [];
            if (options.reverseSort) {
                params.push('rev=1');
            }
            if (options.verb) {
                params.push('v=' + options.verb);
            }
            if (options.level) {
                params.push('l=' + options.level);
            }
            if (options.includeSeen) {
                params.push('seen=1');
            }
            let path = 'api/V1/notifications/?' + params.join('&');
            return this.makeCall('GET', path);
        }

        /**
         * Posts a single notification. User's gotta be special.
         * Note - this was mainly for early-stage debugging. Probably doesn't work
         * anymore unless the user's auth token is really a service token. And if
         * you're logging in with a service token.... don't.
         * @param {object} data
         * - verb
         * - object
         * - level
         * - context (keys text, link)
         */
        postNotification(data) {
            let path = 'api/V1/notification';
            return this.makeCall('POST', path, data);
        }

        /**
         * Posts a Global notification on behalf of an admin. Requires
         * the used auth token to have the custom auth role FEEDS_ADMIN
         * or an error will occur.
         * @param {object} data
         * - verb
         * - object
         * - level
         * - context (keys: text, link)
         * - expires (optional, default = 30 days after posting)
         */
        postGlobalNotification(data) {
            let path = 'admin/api/V1/notification/global';
            return this.makeCall('POST', path, data);
        }

        /**
         * Marks an array of notification ids as seen by the user.
         * @param {Array} noteIds - array of note id strings
         */
        markSeen(noteIds) {
            let path = 'api/V1/notifications/see';
            return this.makeCall('POST', path, {note_ids: noteIds});
        }

        /**
         * Marks an array of notification ids as unseen by the given user.
         * @param {Array} noteIds - array of note id strings
         */
        markUnseen(noteIds) {
            let path = 'api/V1/notifications/unsee';
            return this.makeCall('POST', path, {note_ids: noteIds});
        }

        /**
         * Expires a single global notification from its id.
         * Requires the user to have the custom auth role FEEDS_ADMIN, or an error
         * will occur.
         * @param {string} noteId - a single notification id
         */
        expireGlobalNotification(noteId) {
            let path = 'admin/api/V1/notifications/expire';
            return this.makeCall('POST', path, {note_ids: [noteId]});
        }

    }
    return FeedsAPI;
});
