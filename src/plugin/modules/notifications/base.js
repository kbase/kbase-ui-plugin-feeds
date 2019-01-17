define([
    '../util'
], function (
    Util
) {
    'use strict';

    class Base {
        constructor(note) {
            this.note = note;
        }

        actorHtml() {
            let actor = this.note.actor,
                actorId = Util.cleanText(actor.id),
                actorName = actor.name ? Util.cleanText(actor.name) : null,
                idHtml = `<a href="#people/${actorId}">${actorId}</a>`,
                actorHtml = '<span class="feed-actor">';

            if (actorName !== null) {
                actorHtml += `${actorName} (${idHtml})`;
            }
            else {
                actorHtml += `${idHtml}`;
            }
            return actorHtml + '</span>';
        }

        buildHtml() {
            let actor = this.actorHtml(),
                msg = actor + ' ' + this.note.verb,
                objText = this.note.object.name ? this.note.object.name : this.note.object.id;
            switch (this.note.verb) {
            case 'invited':
                msg += ' you to join the group ' + objText;
                break;
            case 'shared':
                msg += ' with you.';
                break;
            case 'requested':
                msg += ' to join the group ' + objText;
                break;
            default:
                msg += ' ' + objText;
            }
            return msg;
        }

        getLink() {
            if (this.note.context && this.note.context.link) {
                return this.note.context.link;
            }
            else {
                return '';
            }
        }
    }

    return Base;
});
