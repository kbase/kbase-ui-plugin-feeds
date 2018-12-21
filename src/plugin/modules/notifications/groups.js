define([
    './base'
], function (
    BaseNotification
) {
    'use strict';

    class GroupNotification extends BaseNotification {
        constructor(note) {
            super(note);
        }

        /**
         * Returns an HTML string of the rendered notification.
         * I.e. goes from the structure from the Feeds service to
         * a readable string that makes sense.
         */
        buildHtml() {
            let actor = this.actorHtml(),
                msg = '';

            switch(this.note.verb) {
            case 'requested':
                msg = actor + ' has requested to join the group ' + this.objectHtml() + '.'; // which you administer.';
                break;
            case 'invited':
                msg = actor + ' has invited you to join the group ' + this.objectHtml() + '.';
                break;
            default:
                msg = actor + ' ' + this.note.verb + ' ' + this.note.object;
            }
            return msg;
        }

        /**
         * Returns a link to where a user can resolve this notification, based on
         * the notification's context. If no link is necessary (this is just an
         * alert with no action required), returns null;
         */
        getLink() {
            switch(this.note.verb) {
            case 'requested':
            case 'invited':
                return '#orgs';
            default:
                return null;
            }
        }

        /**
         * Renders the object of this notification. It might be a link to the groups service,
         * it might be just text. Depends on context.
         */
        objectHtml() {
            let msg = '',
                obj = this.note.object;
            switch(this.note.verb) {
            case 'requested':
            case 'invited':
                msg = '<a href="#orgs">' + obj + '</a>';
                break;
            default:
                msg = obj;
                break;
            }
            return msg;
        }
    }

    return GroupNotification;
});
