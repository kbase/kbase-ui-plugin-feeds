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
                msg, obj;
            switch (this.note.verb) {
            case 'invited':
                obj = this.note.object;
                msg = actor + ' ' + this.note.verb + ' you to join the group ' + (obj.name ? obj.name : obj.id);
                break;
            case 'shared':
                msg = actor + ' ' + this.note.verb + ' with you.';
                break;
            case 'requested':
                obj = this.note.object;
                msg = actor + ' ' + this.note.verb + ' to join the group ' + (obj.name ? obj.name : obj.id);
                break;
            default:
                obj = this.note.object;
                msg = actor + ' ' + this.note.verb + ' ' + (obj.name ? obj.name : obj.id);
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
