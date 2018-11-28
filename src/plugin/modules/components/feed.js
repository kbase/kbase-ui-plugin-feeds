define([
    './notification'
], function(
    Notification
) {
    'use strict';

    class Feed {
        constructor(refreshFn, options) {
            this.refreshFn = refreshFn;
            this.userName = options.userName || '';
            this.showControls = options.showControls || false;
            this.showSeen = (options.showSeen === undefined || options.showSeen === null) ? true : options.showSeen;

            this.element = document.createElement('div');
            this.element.classList.add('panel', 'panel-default');
            this.element.style.marginTop = '20px';
            this.element.innerHTML = `
                <div class="panel-heading">
                    <span class="panel-title">
                        <span id="user-feed-name">${this.userName}</span> notifications
                    </span>
                    ${this.showControls ? this.renderFilters() : ''}
                </div>
                <div class="panel-body"></div>
            `;
            this.ctrlState = {
                includeSeen: false,
                reverseSort: false,
                level: null,
                verb: null,
                source: null
            };
            if (this.showControls) {
                this.bindEvents();
            }
        }

        bindEvents() {
            let ctrls = this.element.querySelector('.panel-heading div.input-group');
            // toggle eye
            ctrls.querySelector('#seen-btn').onclick = () => {
                let btnIcon = ctrls.querySelector('#seen-btn svg');
                if (btnIcon.getAttribute('data-icon') === 'eye-slash') {
                    btnIcon.setAttribute('data-icon', 'eye');
                    this.ctrlState.includeSeen = true;
                }
                else {
                    btnIcon.setAttribute('data-icon', 'eye-slash');
                    this.ctrlState.includeSeen = false;
                }
                this.refresh();
            }

            // toggle order
            ctrls.querySelector('#sort-btn').onclick = () => {
                let btnIcon = ctrls.querySelector('#sort-btn svg');
                if (btnIcon.getAttribute('data-icon') === 'sort-numeric-desc') {
                    btnIcon.setAttribute('data-icon', 'sort-numeric-asc');
                    this.ctrlState.reverseSort = false;
                }
                else {
                    btnIcon.setAttribute('data-icon', 'sort-numeric-desc');
                    this.ctrlState.reverseSort = true;
                }
                this.refresh();
            }

            // level filter
            ctrls.querySelector('#level-filter').onchange = (e) => {
                if (e.target.selectedIndex === 0) {
                    this.ctrlState.level = null;
                }
                else {
                    this.ctrlState.level = e.target.value;
                }
                this.refresh();
            }

            // source filter
            ctrls.querySelector('#source-filter').onchange = (e) => {
                if (e.target.selectedIndex === 0) {
                    this.ctrlState.source = null;
                }
                else {
                    this.ctrlState.source = e.target.value;
                }
                this.refresh();
            }
        }

        refresh() {
            // get filter info from controls
            // run the refresh function
            // update this feed with the results
            console.log(this.ctrlState);
            this.refreshFn(this.ctrlState);
        }

        renderFilters() {
            let levels = ['alert', 'warning', 'error', 'request'],
                services = ['groups', 'workspace', 'jobs', 'narrative'],
                filterHtml = `
                    <div class="input-group input-group-sm pull-right" style="max-width: 350px">
                        <button class="btn btn-outline-secondary" type="button" id="seen-btn">
                            <i class="fa fa-eye-slash"></i>
                        </button>
                        <button class="btn btn-outline-secondary" type="button" id="sort-btn">
                            <i class="fa fa-sort-numeric-asc"></i>
                        </button>
                        <select class="custom-select" id="level-filter">
                            <option selected>Filter Level</option>
                            ${levels.map(level => `<option value="${level}">${level}</option>`)}
                        </select>
                        <select class="custom-select" id="source-filter">
                            <option selected>Filter Source</option>
                            ${services.map(service => `<option value="${service}">${service}</option>`)}
                        </select>
                    </div>
                `;

            return filterHtml;
        }

        remove() {
            this.element.querySelector('.panel-body').innerHTML = '';
        }

        updateFeed(feed, token) {
            this.remove();
            let userFeed = this.element.querySelector('.panel-body');
            feed.forEach(note => {
                let noteObj = new Notification(note, token, this.refresh.bind(this), this.showSeen);
                userFeed.appendChild(noteObj.element);
            });
        }

        setUserName(userName) {
            this.userName = userName;
            this.element.querySelector('#user-feed-name').innerHTML = userName;
        }
    }
    return Feed;
});