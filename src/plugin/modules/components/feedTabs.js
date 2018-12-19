/**
 *
 */
define([
    './notification',
    '../util'
], function (
    Notification,
    Util
) {
    'use strict';

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
            this.feedUpdateFn = config.feedUpdateFn;
            let feeds = config.feeds;
            this.feeds = {};
            this.order = [];
            this.element = document.createElement('div');
            feeds.forEach((f) => {
                this.feeds[f[0]] = f[1];
                this.order.push(f[0]);
            });
            this.render();
            this.setUnseenCounts(config.unseen);
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
            this.element.querySelector('.feed-tabs div:first-child').click();
        }

        addFeed(feedKey, feedName) {
            let tab = document.createElement('div');
            tab.classList.add('feed-tab-btn');
            tab.innerHTML = `
                <span>${Util.cleanText(feedName)}</span>
                <span class="badge unseen-badge pull-right" style="display: none"><span>
            `;
            // tab.textContent = Util.cleanText(feedName);
            tab.setAttribute('data-name', feedKey);
            tab.onclick = () => {
                this.selectFeed(feedKey);
            };
            this.element.querySelector('.feed-tabs').appendChild(tab);
        }

        selectFeed(feedKey) {
            this.element
                .querySelectorAll('.feed-tabs div')
                .forEach(n => n.classList.remove('feed-selected'));
            this.element
                .querySelector(`.feed-tabs div[data-name="${feedKey}"]`)
                .classList
                .add('feed-selected');
            let contentPane = this.element.querySelector('.feed-content');
            contentPane.appendChild(Util.loadingElement('3x'));
            this.feedUpdateFn(feedKey)
                .then(feed => this.renderFeed(feed.feed));
        }

        renderFeed(notifications) {
            let contentPane = this.element.querySelector('.feed-content');
            contentPane.innerHTML = '';
            notifications.forEach(note => {
                let noteObj = new Notification(note);
                contentPane.appendChild(noteObj.element);
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
            let activeFeed = this.element.querySelector('.feed-tabs .feed-selected').getAttribute('data-name');
            let notes = [];
            if (feed[activeFeed]) {
                notes = feed[activeFeed].feed;
            }
            this.renderFeed(notes);
        }
    }

    return FeedTabs;
});
