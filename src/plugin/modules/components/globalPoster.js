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
            // this.element.style.display = 'none';
            this.element.classList.add('panel', 'panel-primary');
            const verbs = ['invite', 'accept', 'reject', 'share', 'unshare', 'join', 'leave', 'request', 'update'];
            const levels = ['alert', 'warning', 'error', 'request'];
            this.afterSubmitFn = function () {
                config.afterSubmitFn({});
            };

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
                    <div class='form-group mx-sm-3 mb-2'>
                        <label for="level-select"><b>Level</b> - this sets the "importance" of a notification, useful for filtering</label>
                        <select class="form-control custom-select" id="level-select">
                            ${levels.map(level => `<option value="${level}">${level}</option>`)}
                        </select>
                    </div>
                    <div class='form-group mx-sm-3 mb-2'>
                        <label for="expiration"><b>Expiration</b> - adds an expiration time when the notification disappears</label>
                        <input type="text" class="form-control" id="expiration-time" placeholder="Enter a timestamp (ms since epoch. I know. I'll try to make this better before the demo.)"></input>
                    </div>
                    <div class='form-group mx-sm-3 mb-2'>
                        <label for="context-input"><b>Context keys</b> - these are optional. If present, they will provide a link and specific text for the notification</label>
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Text</span>
                            </div>
                            <input type="text" class="form-control" placeholder="Optional text for the notification" id="context-text">
                        </div>
                        <div class="input-group mb-3">
                            <div class="input-group-prepend">
                                <span class="input-group-text">Link</span>
                            </div>
                            <input type="text" class="form-control" placeholder="Link for the notification to link out to" id="context-link">
                        </div>
                    </div>
                    <button type="submit" class="btn btn-primary mb-2" id="postGlobal">Submit</button>
                </div>`;
            this.bindEvents();
        }

        bindEvents() {
            this.element.querySelector('#postGlobal').onclick = () => {
                let verb = this.element.querySelector('#verb-select').value,
                    object = this.element.querySelector('#object-input').value,
                    level = this.element.querySelector('#level-select').value,
                    contextText = this.element.querySelector('#context-text').value,
                    contextLink = this.element.querySelector('#context-link').value,
                    expiration = parseInt(this.element.querySelector('#expiration-time').value),
                    feedsApi = FeedsAPI.make(
                        this.runtime.getConfig('services.feeds.url'),
                        this.runtime.service('session').getAuthToken()
                    );
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