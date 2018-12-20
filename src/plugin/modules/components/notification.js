define([
    '../api/feeds',
    'kb_common/html',
    '../util'
], function(
    FeedsAPI,
    HTML,
    Util
) {
    'use strict';
    let t = HTML.tag,
        div = t('div'),
        span = t('span'),
        small = t('small'),
        i = t('i'),
        a = t('a');

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
            this.note = note;
            this.element = document.createElement('div');
            this.element.classList.add('feed-note');
            if (this.note.seen) {
                this.element.classList.add('seen');
            }
            this.render();
        }

        render() {
            let level = div({class: 'feed-note-icon'}, [this.renderLevel()]),
                body = div({class: 'feed-note-body'}, [this.renderBody()]),
                control = div({class: 'feed-note-control'}, [this.renderControl()]);
            this.element.innerHTML = level + body + control;
            this.bindEvents();
        }

        renderBody() {
            let text = div(this.renderMessage()),
                infoStamp = small(this.renderCreated());
            return text + infoStamp;
        }

        renderControl() {
            let control = '';
            // control += this.renderSeen();
            if (this.note.context && this.note.context.link) {
                control += this.renderLink(this.note.context.link);
            }
            return control;
        }

        renderLink(url) {
            return span(
                {style: 'font-size: 1.5em'},
                a(
                    {href: url, target: '_blank'},
                    i({class: 'fa fa-external-link'})));
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
                icon = 'fa fa-eye';
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
                return Util.cleanText(this.note.context.text);
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
                case 'requested':
                    msg = this.note.actor + ' ' + this.note.verb + ' to join the group ' + this.note.object;
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
        }
    }
    return Notification;
});
