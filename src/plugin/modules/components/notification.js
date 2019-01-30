define([
    'jquery',
    '../api/feeds',
    'kb_common/html',
    '../util',
    '../notifications/base',
    '../notifications/groups'
], function(
    $,
    FeedsAPI,
    HTML,
    Util,
    DefaultNotification,
    GroupsNotification
) {
    'use strict';
    let t = HTML.tag,
        div = t('div'),
        span = t('span'),
        small = t('small'),
        i = t('i'),
        a = t('a');

    const GROUPS = 'groupsservice';

    class Notification {
        /**
         * @param {object} note
         * has keys: actor, context, created, expires, id, level, object, source, verb
         * @param {object} config
         * - token - the auth token
         * - refreshFn - called when something gets marked seen/unseen
         * - showSeen - boolean, if true, shows an icon of whether a notification has been seen
         * - runtime - the runtime object
         * - expireNoteFn - if note null, then this notification can be expired by the user (which means gone forever)
         */
        constructor(note, toggleSeenFn, expireNoteFn) {
            this.note = note;
            this.noteObj = this.makeNoteObj();
            this.toggleSeenFn = toggleSeenFn;
            this.expireNoteFn = expireNoteFn;
            this.element = document.createElement('div');
            this.element.classList.add('feed-note');
            if (this.note.seen) {
                this.element.classList.add('seen');
            }
            this.render();
        }

        makeNoteObj() {
            switch(this.note.source) {
            case GROUPS:
                return new GroupsNotification(this.note);
            default:
                return new DefaultNotification(this.note);
            }
        }

        render() {
            let level = div({class: 'feed-note-icon'}, [this.renderLevel()]),
                body = div({class: 'feed-note-body'}, [this.renderBody()]),
                link = div({class: 'feed-link'}, [this.renderLink()]),
                control = div({class: 'feed-note-control'}, this.renderControl());
            this.element.innerHTML = level + control + link + body;
            this.bindEvents();
        }

        renderBody() {
            let text = div(this.renderMessage()),
                infoStamp = this.renderCreated();
            return text + infoStamp;
        }

        /**
         * Renders controls for dismissing/marking a notification seen.
         */
        renderControl() {
            let seenBtn = '';
            let icon = this.note.seen ? 'eye-slash' : 'eye';
            let text = this.note.seen ? 'unseen' : 'seen';
            if (this.toggleSeenFn) {
                seenBtn = span(
                    {
                        class: 'feed-seen'
                    },
                    i({
                        class: 'fa fa-' + icon,
                        dataToggle: 'tooltip',
                        dataPlacement: 'left',
                        title: 'Mark ' + text,
                        style: 'cursor: pointer'
                    })
                );
            }

            let expBtn = '';
            if (this.expireNoteFn) {
                expBtn = span(
                    {
                        class: 'feed-expire'
                    },
                    i({
                        class: 'fa fa-times',
                        dataToggle: 'tooltip',
                        dataPlacement: 'left',
                        title: 'Expire this notification',
                        style: 'cursor: pointer'
                    })
                );
            }
            return [seenBtn, expBtn];
        }

        renderLink() {
            let url = this.noteObj.getLink();
            if (url) {
                return a({
                    href: url,
                    target: '_blank'
                }, i({
                    class: 'fa fa-external-link'
                }));
            }
            return '';
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
            let date = new Date(this.note.created),
                timeAgo = Util.dateToAgo(date),
                tooltip = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
            return small({
                class: 'feed-timestamp',
                dataToggle: 'tooltip',
                dataPlacement: 'right',
                title: tooltip
            }, [timeAgo]);
        }

        renderSource() {
            return this.note.source;
        }

        renderMessage() {
            if (this.note.context && this.note.context.text) {
                return Util.cleanText(this.note.context.text);
            }
            else {
                return this.noteObj.buildHtml();
            }
        }

        bindEvents() {
            $(this.element).find('[data-toggle="tooltip"]').tooltip();
            let seenBtn = this.element.querySelector('.feed-note-control span.feed-seen');
            if (seenBtn) {
                seenBtn.onclick = () => this.toggleSeenFn(this.note);
            }
            let expireBtn = this.element.querySelector('.feed-note-control span.feed-expire');
            if (expireBtn) {
                expireBtn.onclick = () => this.expireNoteFn(this.note);
            }
        }
    }
    return Notification;
});
