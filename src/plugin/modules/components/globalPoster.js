define([
    '../api/feeds'
], function(FeedsAPI) {
    'use strict';

    class GlobalFeedPoster {
        /**
         *
         * @param {object} config
         * - afterSubmitFn - what happens after a notification is submitted
         * - runtime - the runtime object
         *
         */
        constructor(config) {
            this.runtime = config.runtime;
            this.element = document.createElement('div');
            this.element.classList.add('panel', 'panel-primary');
            const verbs = ['invite', 'accept', 'reject', 'share', 'unshare', 'join', 'leave', 'request', 'update'];
            const levels = ['alert', 'warning', 'error', 'request'];
            this.afterSubmitFn = function () {
                config.afterSubmitFn({});
            };

            let curDate = new Date(),
                defaultExp = new Date(curDate.getTime() + (30 * 24 * 60 * 60 * 1000));

            let OLD = `
                <div class='form-group mx-sm-3 mb-2'>
                    <label for="verb-select"><b>Verb</b> - this tells the notification what's happening.</label>
                    <select class="form-control custom-select" id="verb-select">
                        ${verbs.map(verb => `<option value="${verb}">${verb}</option>`)}
                    </select>
                </div>
                <div class='form-group mx-sm-3 mb-2'>
                    <label for="object-input"><b>Object</b> - this field sets the notification to what the event is affecting.</label>
                    <input class="form-control" id="object-input" placeholder="Enter object" />
                    <small class="form-text text-muted"></small>
                </div>
            `;

            this.element.innerHTML = `
                <div class='panel-heading'>
                    <b>Create Global Notification</b> - create a new global notification. Everyone gets to see this.
                    <div class="btn btn-default pull-right" style="margin-top: -6px;" data-toggle="collapse" href="#globalFeedInput">
                        <span>
                            <i class="fa fa-toggle-off"></i>
                        </span>
                    </div>
                </div>
                <div class='panel-body collapse' id="globalFeedInput">
                    <div class='form-group'>
                        <label for="context-text">Notification text</label>
                        <input type="text" class="form-control" id="context-text" placeholder="Set the notification text here"></input>
                    </div>
                    <div class='form-group'>
                        <label for="context-text">Notification link</label>
                        <input type="text" class="form-control" id="context-link" placeholder="Add an optional hyperlink here"></input>
                    </div>

                    <div class='form-group mx-sm-3 mb-2'>
                        <label for="level-select"><b>Level</b> - this sets the "importance" of a notification</label>
                        <select class="form-control custom-select" id="level-select">
                            ${levels.map(level => `<option value="${level}">${level}</option>`)}
                        </select>
                    </div>
                    <label for="expiration"><b>Expiration</b> - adds an expiration time when the notification disappears (24h format)</label>
                    <div class='form-group form-inline' id="expiration">
                        <label for="exp-year">Year</label>
                        <input type="number" class="form-control" id="exp-year" placeholder="YYYY" min=2019 value=${defaultExp.getFullYear()}></input>
                        <label for="exp-mon">Month</label>
                        <select class="form-control" id="exp-mon">
                            ${this.generateMonths(defaultExp)}
                        </select>
                        <label for="exp-day">Day</label>
                        <input type="number" class="form-control" id="exp-day" placeholder="DD" value=${defaultExp.getDate()} min=1 max=31></input>
                        <label for="exp-hour">Hour</label>
                        <input type="number" class="form-control" id="exp-hour" min=0 max=23 value=${defaultExp.getHours()} placeholder="HH"></input>
                        <label for="exp-min">Minute</label>
                        <input type="number" class="form-control" id="exp-min" min=0 max=59 value=${defaultExp.getMinutes()} placeholder="MM"></input>
                    </div>
                    <button type="submit" class="btn btn-primary mb-2" id="postGlobal">Submit</button>
                </div>`;
            this.bindEvents();
        }

        generateMonths(date) {
            let curMonth = date.getMonth();
            let months = [
                'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August',
                'September', 'October', 'November', 'December'
            ].map((m, i) => {
                let selected = i === curMonth ? ' selected' : '';
                return '<option value=' + i + selected + '>' + m + '</option>';
            });
            return months;
        }

        validateDay(day, month, year) {
            return new Date(year, month, day).getDate() === day;
        }

        getExpirationTimestamp() {
            let curDate = new Date();
            let year = parseInt(this.element.querySelector('#exp-year').value),
                month = parseInt(this.element.querySelector('#exp-mon').value),
                day = parseInt(this.element.querySelector('#exp-day').value),
                hour = parseInt(this.element.querySelector('#exp-hour').value),
                min = parseInt(this.element.querySelector('#exp-min').value),
                sec = curDate.getSeconds(),
                fail = false;

            // error trapping here
            if (isNaN(year) || year < curDate.getFullYear()) {
                alert('Year must be a number >= ' + curDate.getFullYear());
                fail = true;
            }
            else if (isNaN(month) || (month < curDate.getMonth() && year === curDate.getFullYear())) {
                alert('Month must not be set to something in the past.');
                fail = true;
            }
            else if (isNaN(day) || day <= 0 || !this.validateDay(day, month, year)) {
                alert('Day is either not a number, or invalid for the selected month');
                fail = true;
            }
            else if (isNaN(hour) || hour < 0 || hour > 23) {
                alert('Hour must be a number between 0 and 23');
                fail = true;
            }
            else if (isNaN(min) || min < 0 || min > 59) {
                alert('Minute must be a number between 0 and 59');
                fail = true;
            }

            let expDate = new Date(year, month, day, hour, min, sec);
            if (expDate <= curDate) {
                alert("Don't expire the notification before it's made, please.");
                fail = true;
            }
            if (fail) {
                return null;
            }
            return expDate.getTime();
        }

        bindEvents() {
            this.element.querySelector('#postGlobal').onclick = () => {
                let verb = 'update', //this.element.querySelector('#verb-select').value,
                    object = 'none', //this.element.querySelector('#object-input').value,
                    level = this.element.querySelector('#level-select').value,
                    contextText = this.element.querySelector('#context-text').value,
                    contextLink = this.element.querySelector('#context-link').value,
                    expiration = this.getExpirationTimestamp(),
                    feedsApi = FeedsAPI.make(
                        this.runtime.getConfig('services.feeds.url'),
                        this.runtime.service('session').getAuthToken()
                    );
                if (expiration === null) {
                    console.error('Illegal expiration!');
                    return;
                }
                feedsApi.postGlobalNotification({
                    verb: verb,
                    object: object,
                    level: level,
                    expires: expiration,
                    context: {
                        text: contextText,
                        link: contextLink
                    }
                })
                    .then(this.afterSubmitFn)
                    .then(() => {
                        this.element.querySelector('.panel-heading .btn').click();
                    })
                    .catch((err) => {
                        console.error('An error occurred while posting a new global notification.');
                        console.error(err);
                    });
            };
            this.element.querySelector('.panel-heading .btn').onclick = () => {
                let btnIcon = this.element.querySelector('.panel-heading .btn i.fa');
                if (btnIcon.classList.contains('fa-toggle-off')) {
                    btnIcon.classList.replace('fa-toggle-off', 'fa-toggle-on');
                }
                else {
                    btnIcon.classList.replace('fa-toggle-on', 'fa-toggle-off');
                }
            };
        }
    }

    return GlobalFeedPoster;
});
