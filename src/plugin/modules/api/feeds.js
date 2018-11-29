define([
], function(
) {
    'use strict';
    /**
     * Basic feeds API.
     */
    // import axios from 'axios';
    // const feedsUrl = 'https://ci.kbase.us/services/feeds/';

    /**
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
         *
         * @param {string} method
         * @param {string} path
         * @param {object} options
         */
        function makeApiCall (method, path, data) {
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
            console.log(request);
            return fetch(url, request)
                .then(handleErrors);
        }

        function handleErrors (response) {
            if (!response.ok) {
                console.error(response);
                throw Error(response.statusText);
            }
            return response;
        }

        /**
         *
         * @param {object} options
         *  - reverseSort - boolean
         *  - verb - string or int
         *  - level - string or int
         *  - includeSeen - boolean
         */
        function getNotifications (options) {
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
            console.log(path);
            return makeApiCall('GET', path);
        }

        /**
         *
         * @param {object} data
         * - verb
         * - object
         * - level
         * - context (keys text, link)
         */
        function postNotification (data) {
            let path = 'api/V1/notification';
            return makeApiCall('POST', path, data);
        }

        function postGlobalNotification (data) {
            let path = 'api/V1/notification/global';
            return makeApiCall('POST', path, data);
        }

        function markSeen(noteIds) {
            let path = 'api/V1/notifications/see';
            return makeApiCall('POST', path, {note_ids: noteIds});
        }

        function markUnseen(noteIds) {
            let path = 'api/V1/notifications/unsee';
            return makeApiCall('POST', path, {note_ids: noteIds});
        }

        return {
            getNotifications: getNotifications,
            postNotification: postNotification,
            postGlobalNotification: postGlobalNotification,
            markSeen: markSeen,
            markUnseen: markUnseen
        };
    }

    return {
        make: (endpoint, token) => {
            return factory(endpoint, token);
        }
    };
});