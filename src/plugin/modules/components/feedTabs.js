/**
 *
 */
define([
    './notification',
    '../util',
    '../api/feeds'
], function (
    Notification,
    Util,
    FeedsAPI
) {
    'use strict';
    const SEEN_TIMEOUT = 10000;

    class FeedTabs {
        /**
         *
         * @param {Object} config
         * feeds = list of feeds in order they should appear (key and full name)
         *  - [[global, KBase], [user, Some User], [group1, My Special Group], ...]
         * element = target DOM node to render in
         *
         */
        constructor(config) {
            this.runtime = config.runtime;
            this.feedUpdateFn = config.feedUpdateFn;
            let feeds = config.feeds;
            this.feeds = {};
            this.order = [];
            this.element = document.createElement('div');
            this.element.classList.add('feeds-tabs-container');
            feeds.forEach((f) => {
                this.feeds[f[0]] = f[1];
                this.order.push(f[0]);
            });
            this.notes = config.globalFeed;
            this.render();
            this.setUnseenCounts(config.unseen);
            this.renderFeed();
        }

        render() {
            // Make the general structure
            // run addFeed on each element
            // select the first one and refresh it
            this.mainElem = document.createElement('div');
            this.element.appendChild(this.mainElem);
            let structure = `
                <div class="feed-tabs"></div>
                <div class="feed-content"></div>
            `;
            this.element.innerHTML = structure;
            this.order.forEach(f => this.addFeed(f, this.feeds[f]));
            this.element.querySelector('.feed-tabs div:first-child').classList.add('feed-selected');
        }

        addFeed(feedKey, feedName) {
            let tab = document.createElement('div');
            tab.classList.add('feed-tab-btn');
            tab.innerHTML = `
                <span>${Util.cleanText(feedName)}</span>
                <span class="badge unseen-badge pull-right" style="display: none"><span>
            `;
            tab.setAttribute('data-name', feedKey);
            tab.onclick = () => {
                this.selectFeed(feedKey);
            };
            this.element.querySelector('.feed-tabs').appendChild(tab);
        }

        selectFeed(feedKey) {
            let currentFeed = this.element.querySelector('.feed-tabs div.feed-selected');
            if (feedKey === currentFeed.getAttribute('data-name')) {
                return;
            }
            this.element
                .querySelectorAll('.feed-tabs div')
                .forEach(n => n.classList.remove('feed-selected'));
            this.element
                .querySelector(`.feed-tabs div[data-name="${feedKey}"]`)
                .classList
                .add('feed-selected');
            let contentPane = this.element.querySelector('.feed-content');
            contentPane.innerHTML = '';
            contentPane.appendChild(Util.loadingElement('3x'));
            this.feedUpdateFn(feedKey)
                .then(feed => this.refresh(feed));
        }

        renderFeed() {
            console.log(this.notes);
            let contentPane = this.element.querySelector('.feed-content');
            contentPane.innerHTML = '';
            this.notes.forEach(note => {
                let noteObj = new Notification(note, this.toggleSeen.bind(this));
                contentPane.appendChild(noteObj.element);
            });
        }

        toggleSeen(note) {
            let feedsApi = FeedsAPI.make(
                this.runtime.getConfig('services.feeds.url'),
                this.runtime.service('session').getAuthToken()
            );
            let prom = null;
            if (note.seen) {
                prom = feedsApi.markUnseen([note.id]);
            }
            else {
                prom = feedsApi.markSeen([note.id]);
            }
            prom.then((res) => {
                if ((res.unseen_notes && res.unseen_notes[0] === note.id) ||
                    (res.seen_notes && res.seen_notes[0] === note.id)) {
                    let noteElem = this.notes.find(n => n.id === note.id);
                    noteElem.seen = !noteElem.seen;
                    this.renderFeed();
                }
            });
        }

        /**
         *
         * @param {Object} unseen
         * KVP - keys = key name of feeds, values = number of unseen
         */
        setUnseenCounts(unseen) {
            this.element
                .querySelectorAll('.feed-tabs span.badge')
                .forEach(n => n.style.display='none');

            for (const feedKey in unseen) {
                let count = unseen[feedKey];
                if (count > 0) {
                    let badge = this.element.querySelector(`.feed-tabs div[data-name=${feedKey}] span.badge`);
                    badge.innerHTML = unseen[feedKey];
                    badge.style.display = null;
                }
            }
        }

        refresh(feed) {
            // this.removeSeenTimeout();
            this.notes = feed.feed;
            this.renderFeed();
            // this.initSeenTimeout();
        }

        removeSeenTimeout() {
            if (this.seenTimeout) {
                clearTimeout(this.seenTimeout);
            }
        }

        initSeenTimeout() {
            this.seenTimeout = setTimeout(() => {
                let noteIds = this.notes.map(note => note.id),
                    feedsApi = FeedsAPI.make(
                        this.runtime.getConfig('services.feeds.url'),
                        this.runtime.service('session').getAuthToken()
                    );
                feedsApi.markSeen(noteIds)
                    .then((seenResult) => {
                        let idNotes = {};
                        this.notes.forEach(n => idNotes[n.id] = n);
                        seenResult.seen_notes.forEach(id => idNotes[id].seen = true);
                        this.renderFeed();
                    })
                    .catch((err) => {
                        console.error(err);
                        alert('error while marking seen');
                    });
            }, SEEN_TIMEOUT);
        }
    }

    return FeedTabs;
});
