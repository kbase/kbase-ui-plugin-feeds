define([
    'bluebird',
    '../api/feeds',
    './feed',
    './globalPoster',
    './feedTabs',
    '../util'
], function (
    Promise,
    FeedsAPI,
    Feed,
    GlobalPoster,
    FeedTabs,
    Util
) {
    'use strict';

    class FeedController {
        constructor(config) {
            let runtime = config.runtime;
            this.token = runtime.service('session').getAuthToken();
            this.notes = [];
            this.element = document.createElement('div');
            this.feedsApi = FeedsAPI.make(runtime.getConfig('services.feeds.url'), this.token);
            let loader = Util.loadingElement('3x');
            this.feedData = {};

            this.element.appendChild(loader);
            this.initializeData()
                .then((feedData) => {
                    this.element.innerHTML = '';
                    if (runtime.service('session').getCustomRoles().includes('FEEDS_ADMIN')) {
                        this.globalPoster = new GlobalPoster({
                            afterSubmitFn: this.refreshFeed.bind(this),
                            runtime: runtime
                        });
                        this.element.appendChild(this.globalPoster.element);
                    }

                    let feedList = [
                        ['global', 'KBase Global'],
                        ['user', runtime.service('session').getRealname()]
                    ];

                    let unseenSet = {};
                    for (const f in feedData) {
                        unseenSet[f] = feedData[f].unseen;
                    }

                    this.feedTabs = new FeedTabs({
                        feeds: feedList,
                        feedUpdateFn: this.updateFeed.bind(this),
                        unseen: unseenSet
                    });
                    this.element.appendChild(this.feedTabs.element);
                });
        }

        updateFeed(feedKey) {
            return this.feedsApi.getNotifications({includeSeen: true})
                .then(response => {
                    return response.json();
                })
                .then(feed => {
                    console.log(feed);
                    if (feed[feedKey]) {
                        return feed[feedKey];
                    }
                    else {
                        return {};
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        }

        initializeData() {
            return this.feedsApi.getNotifications({})
                .then(response => {
                    return response.json();
                })
                .then(feed => {
                    console.log(feed);
                    return feed;
                })
                .catch(err => {
                    this.renderError(err);
                });
        }

        /**
         *
         * @param {object} filters
         *  - reverseSort - boolean
         *  - verb - string or int
         *  - level - string or int
         *  - source - string
         *  - includeSeen - boolean
         */
        refreshFeed() {
            this.feedsApi.getNotifications({includeSeen: true})
                .then(response => {
                    return response.json();
                })
                .then(feed => {
                    this.feedTabs.refresh(feed);
                    let unseenSet = {};
                    for (const f in feed) {
                        unseenSet[f] = feed[f].unseen;
                    }
                    this.feedTabs.setUnseenCounts(unseenSet);
                })
                .catch(err => {
                    this.renderError(err);
                });
        }

        renderFeed(feed) {
            this.removeFeed();
            this.globalFeed.updateFeed(feed.global, this.token);
            this.userFeed.updateFeed(feed.user, this.token);
            this.element.style.removeProperty('display');
        }

        renderError(err) {
            console.log(err);
            console.log(JSON.stringify(err));
            this.element.innerHTML = `
                <div class="alert alert-danger">
                    An error occurred while fetching your feed!
                </div>
            `;
        }
    }

    return FeedController;
});
