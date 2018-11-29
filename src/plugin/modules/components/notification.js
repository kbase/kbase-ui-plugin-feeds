define([
    '../api/feeds'
], function(
    FeedsAPI
) {
    'use strict';

    class Notification {
        /**
         * @param {object} note
         * has keys: actor, context, created, expires, id, level, object, source, verb
         * @param {object} config
         * - token - the auth token
         * - refreshFn - called when something gets marked seen/unseen
         * - showSeen - boolean, if true, shows an icon of whether a notification has been seen
         * - runtime - the runtime object
         */
        constructor(note, config) {
            this.runtime = config.runtime;
            this.note = note;
            this.token = config.token;
            this.refreshFn = config.refreshFn;
            this.showSeen = config.showSeen;
            this.element = document.createElement('div');
            this.element.classList.add('row', 'alert');
            this.render();
        }

        render() {
            this.element.innerHTML = `
                <div class="col-md-1">${this.renderLevel()}</div>
                <div class="col-md-10">${this.renderBody()}</div>
                <div class="col-md-1">${this.renderControl()}</div>
            `;
            this.bindEvents();
        }

        renderBody() {
            let text = `
                <div>${this.renderMessage()}</div>
            `;
            let infoStamp = `
                <small>${this.renderCreated()} - ${this.note.source}</small>
            `;
            return text + infoStamp;
        }

        renderControl() {
            let control = '';
            if (this.showSeen) {
                control += this.renderSeen();
            }
            if (this.note.context && this.note.context.link) {
                control += this.renderLink(this.note.context.link);
            }
            return control;
        }

        renderLink(url) {
            return `<span style="font-size: 1.5em;"><a href="${url}" target="_blank"><i class="fa fa-external-link-alt"></i></a></span>`;
        }

        renderLevel() {
            let icon = 'fa fa-info';
            switch(this.note.level) {
            case 'error':
                icon = 'fa fa-ban';
                this.element.classList.add('alert-danger');
                break;
            case 'request':
                icon = 'fa fa-question-circle';
                this.element.classList.add('alert-success');
                break;
            case 'warning':
                icon = 'fa fa-exclamation-triangle';
                this.element.classList.add('alert-warning');
                break;
            case 'alert':
            default:
                icon = 'fa fa-info';
                this.element.classList.add('alert-info');
            }
            return `<span style="font-size: 1.5em;"><i class="${icon}"></i></span>`;
        }

        renderSeen() {
            let icon = 'fa fa-times';
            if (this.note.seen) {
                icon = 'far fa-eye';
            }
            return `
                <span style="font-size: 1.5em; cursor: pointer;" id="seen-icon">
                    <i class="${icon}"></i>
                </span>
            `;
        }

        renderCreated() {
            let date = new Date(this.note.created);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
        }

        renderSource() {
            return this.note.source;
        }

        renderMessage() {
            if (this.note.context && this.note.context.text) {
                return this.note.context.text;
            }
            else {
                let msg;
                switch(this.note.verb) {
                case 'invited':
                    let obj = this.note.object;
                    if (this.note.context && this.note.context.groupid) {
                        obj = this.note.context.groupid;
                    }
                    msg = this.note.actor + ' ' + this.note.verb + ' you to join ' + obj;
                    break;
                case 'shared':
                    msg = this.note.actor + ' ' + this.note.verb + ' with you.';
                    break;
                default:
                    msg = this.note.actor + ' ' + this.note.verb + ' ' + this.note.object;
                }
                return msg;
            }
        }

        bindEvents() {
            if (!this.showSeen) {
                return;
            }
            this.element.querySelector('#seen-icon').onclick = () => {
                let action;
                let feedsApi = FeedsAPI.make(this.runtime.getConfig('services.feeds.url'), this.token);
                if (this.note.seen) {
                    action = feedsApi.markUnseen([this.note.id]);
                }
                else {
                    action = feedsApi.markSeen([this.note.id]);
                }
                action.then((response) => {
                    console.log(response);
                    this.refreshFn();
                });
            };
        }
    }
    return Notification;
});