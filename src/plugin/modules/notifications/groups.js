define([
    './base'
], function (
    BaseNotification
) {
    'use strict';

    class GroupNotification extends BaseNotification {
        constructor(note, currentUserId) {
            super(note, currentUserId);
        }

        /**
         * Returns an HTML string of the rendered notification.
         * I.e. goes from the structure from the Feeds service to
         * a readable string that makes sense.
         */
        buildHtml() {
            let actor = this.entityHtml(this.note.actor),
                msg = '',
                target = this.note.target;

            switch(this.note.verb) {
            case 'requested':
                if (target.length) {
                    if (target.length === 1) {
                        msg = actor + ' has requested to add ';
                        // if (target[0].type === 'workspace') {
                        //     msg += ' the Workspace ';
                        // } else {
                        //     msg += ' the Narrative ';
                        // }
                        msg += this.entityHtml(target[0]) + ' to '; //the group ';
                    }
                }
                else {
                    msg = actor + ' has requested to join '; // the group ';
                }
                msg += this.entityHtml(this.note.object) + '.';
                break;
            case 'invited':
                msg = actor + ' has invited you to join ' + this.entityHtml(this.note.object) + '.';
                break;
            case 'accepted':
                if (target && target.length) {
                    msg = target.map(t => this.entityHtml(t)).join(', ');
                    if (target.length > 1) {
                        msg += ' have ';
                    }
                    else {
                        msg += ' has ';
                    }
                    msg += ' been added to ' + this.entityHtml(this.note.object) + '.';
                }
                else {
                    msg = this.actorHtml() + ' accepted the invitation from ' + this.entityHtml(this.note.object);
                }
                break;
            default:
                msg = actor + ' ' + this.note.verb + ' ' + this.entityHtml(this.note.object);
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
    }

    return GroupNotification;
});
