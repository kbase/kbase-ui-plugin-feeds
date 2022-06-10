define(['../api/feeds', './globalPoster', './feedTabs', '../util'], function (FeedsAPI, GlobalPoster, FeedTabs, Util) {
    'use strict';
    class FeedController {
        constructor(config) {
            const runtime = config.runtime;
            this.token = runtime.service('session').getAuthToken();
            this.userId = runtime.service('session').getUsername();
            this.notes = [];
            this.element = config.element;
            this.feedsApi = new FeedsAPI(runtime.getConfig('services.feeds.url'), this.token);
            const loader = Util.loadingElement('5x');
            this.feedData = {};
            this.isAdmin = false;

            this.element.appendChild(loader);
            this.initializeData().then((feedData) => {
                const token = runtime.service('session').getAuthToken();
                return runtime
                    .service('session')
                    .auth2Client.getMe(token)
                    .then(({ customroles }) => {
                        this.element.innerHTML = '';
                        if (customroles.includes('FEEDS_ADMIN')) {
                            this.isAdmin = true;
                            this.globalPoster = new GlobalPoster({
                                afterSubmitFn: this.refreshFeed.bind(this),
                                runtime: runtime
                            });
                            this.element.appendChild(this.globalPoster.element);
                        }

                        this.myFeeds = {};
                        // make an object from all feeds where key = feed id, value = feed info
                        Object.keys(feedData).forEach((feed) => {
                            this.myFeeds[feed] = [feed, feedData[feed].name];
                        });
                        this.myFeeds.global[1] = 'KBase Announcements';
                        // make the order. Should be:
                        // 0. global
                        // 1. user
                        // rest = other feeds in alphabetical order
                        // seed with just global and user
                        const feedOrder = Object.keys(this.myFeeds);
                        feedOrder.splice(feedOrder.indexOf('global'), 1);
                        feedOrder.splice(feedOrder.indexOf('user'), 1);
                        feedOrder.sort((a, b) => {
                            return feedData[a].name.localeCompare(feedData[b].name);
                        });
                        feedOrder.unshift('user');
                        feedOrder.unshift('global');

                        const feedList = feedOrder.map((feed) => this.myFeeds[feed]);

                        const unseenSet = {};
                        for (const f in feedData) {
                            unseenSet[f] = feedData[f].unseen;
                        }

                        this.feedTabs = new FeedTabs({
                            feeds: feedList,
                            feedUpdateFn: this.updateFeed.bind(this),
                            unseen: unseenSet,
                            globalFeed: feedData.global.feed,
                            runtime: runtime,
                            isAdmin: this.isAdmin,
                            userId: this.userId
                        });
                        this.element.appendChild(this.feedTabs.element);
                    });
            });
        }

        updateFeed(feedKey) {
            return this.feedsApi
                .getNotifications({ includeSeen: true })
                .then((feed) => {
                    if (feed[feedKey]) {
                        return feed[feedKey];
                    } else {
                        return {};
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        }

        initializeData() {
            return this.feedsApi
                .getNotifications({})
                .then((feed) => {
                    return feed;
                })
                .catch((err) => {
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
            this.feedsApi
                .getNotifications({ includeSeen: true })
                .then((feed) => {
                    this.feedTabs.refresh(feed);
                    const unseenSet = {};
                    for (const f in feed) {
                        unseenSet[f] = feed[f].unseen;
                    }
                    this.feedTabs.setUnseenCounts(unseenSet);
                })
                .catch((err) => {
                    this.renderError(err);
                });
        }

        renderError(err) {
            console.error(err);
            // xss safe
            this.element.innerHTML = `
                <div class="alert alert-danger">
                    An error occurred while fetching your feed!
                </div>
            `;
        }
    }

    return FeedController;
});
