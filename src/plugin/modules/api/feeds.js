define([
], function(
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
    function factory(endpoint, token) {
        if (!endpoint) {
            throw new Error('Feeds endpoint required!');
        }
        if (!endpoint.endsWith('/')) {
            endpoint = endpoint + '/';
        }
        if (!token) {
            throw new Error('Auth token required');
        }

        /**
         * Makes a generic API call to the feeds service.
         * Really, this could probably be used for any RESTish service.
         * It's also really really simple. Just given the method, path,
         * and data, it crafts the REST call by using the Fetch API.
         * If the method isn't one of the usual HTTP verbs (GET, POST, PUT, DELETE),
         * this raises an error.
         * This returns a Promise with either the result of the call de-JSONified,
         * or it raises an error.
         * @param {string} method
         * @param {string} path
         * @param {object} options
         */
        function makeApiCall(method, path, data) {
            // remove the first slash, if present
            if (path.startsWith('/')) {
                path = path.substring(1);
            }
            method = method.toLocaleUpperCase();
            if (!['GET', 'POST', 'PUT', 'DELETE'].includes(method)) {
                throw new Error('Method ' + method + ' not usable');
            }
            let url = endpoint + path;
            let request = {
                method: method,
                cache: 'no-cache',
                headers: {
                    'Content-type': 'application/json; charset=utf-8',
                    'Authorization': token
                },
                redirect: 'follow',
                referrer: 'no-referrer',
                maxRedirects: 5
            };
            if (data) {
                request.body = JSON.stringify(data);
            }
            return fetch(url, request)
                .then(handleErrors)
                .then(response => response.json());
        }

        /**
         * Invisibly deals with errors from Fetch. Fetch is nice, but annoying in
         * that the 400-level errors don't raise errors on their own. This wraps
         * the call and deals with that before returning the response to whatever
         * called this API.
         * @param {object} response - a response from the Fetch API.
         */
        function handleErrors(response) {
            if (!response.ok) {
                console.error(response);
                throw Error(response.statusText);
            }
            return response;
        }

        /**
         * Returns the list of notifications for a single user.
         * @param {object} options
         *  - reverseSort - boolean
         *  - verb - string or int
         *  - level - string or int
         *  - includeSeen - boolean
         */
        function getNotifications(options) {
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
            return makeApiCall('GET', path);
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
        function postNotification(data) {
            let path = 'api/V1/notification';
            return makeApiCall('POST', path, data);
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
        function postGlobalNotification(data) {
            let path = 'admin/api/V1/notification/global';
            return makeApiCall('POST', path, data);
        }

        /**
         * Marks an array of notification ids as seen by the user.
         * @param {Array} noteIds - array of note id strings
         */
        function markSeen(noteIds) {
            let path = 'api/V1/notifications/see';
            return makeApiCall('POST', path, {note_ids: noteIds});
        }

        /**
         * Marks an array of notification ids as unseen by the given user.
         * @param {Array} noteIds - array of note id strings
         */
        function markUnseen(noteIds) {
            let path = 'api/V1/notifications/unsee';
            return makeApiCall('POST', path, {note_ids: noteIds});
        }

        /**
         * Expires a single global notification from its id.
         * Requires the user to have the custom auth role FEEDS_ADMIN, or an error
         * will occur.
         * @param {string} noteId - a single notification id
         */
        function expireGlobalNotification(noteId) {
            let path = 'admin/api/V1/notifications/expire';
            return makeApiCall('POST', path, {note_ids: [noteId]});
        }

        return {
            getNotifications: getNotifications,
            postNotification: postNotification,
            postGlobalNotification: postGlobalNotification,
            markSeen: markSeen,
            markUnseen: markUnseen,
            expireGlobalNotification: expireGlobalNotification
        };
    }

    return {
        make: (endpoint, token) => {
            return factory(endpoint, token);
        }
    };
});
