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
                msg = '',
                objText = this.note.object.name ? this.note.object.name : this.note.object.id;

            switch(this.note.verb) {
            case 'requested':
                msg = actor + ' has requested to join the group ' + this.objectHtml() + '.'; // which you administer.';
                break;
            case 'invited':
                msg = actor + ' has invited you to join the group ' + this.objectHtml() + '.';
                break;
            default:
                msg = actor + ' ' + this.note.verb + ' ' + objText;
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
                return '';
            }
        }

        /**
         * Renders the object of this notification. It might be a link to the groups service,
         * it might be just text. Depends on context.
         */
        objectHtml() {
            let msg = '',
                obj = this.note.object,
                objText = obj.name ? obj.name : obj.id,
                url = '#orgs';
            switch(this.note.verb) {
            case 'requested':
            case 'invited':
                if (obj.name) {
                    url += '?view=org&viewParams={\'id\':\'' + obj.id + '\'}';
                }
                msg = '<a href="' + url + '">' + objText + '</a>';
                break;
            default:
                msg = objText;
                break;
            }
            return msg;
        }
    }

    return GroupNotification;
});
