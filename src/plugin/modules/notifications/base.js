define([
    '../util'
], function(
    Util
) {
    'use strict';

    class Base {
        constructor(note) {
            this.note = note;
        }

        actorHtml() {
            let actorId = Util.cleanText(this.note.actor),
                actorName = Util.cleanText(this.note.actor_name),
                idHtml = `<a href="#people/${actorId}">${actorId}</a>`,
                actorHtml = '<span class="feed-actor">';

            if (actorName) {
                actorHtml += `${actorName} (${idHtml})`;
            }
            else {
                actorHtml += `${idHtml}`;
            }
            return actorHtml + '</span>';
        }

        buildHtml() {
            let actor = this.actorHtml(),
                msg;
            switch(this.note.verb) {
            case 'invited':
                let obj = this.note.object;
                if (this.note.context && this.note.context.groupid) {
                    obj = this.note.context.groupid;
                }
                msg = actor + ' ' + this.note.verb + ' you to join ' + obj;
                break;
            case 'shared':
                msg = actor + ' ' + this.note.verb + ' with you.';
                break;
            case 'requested':
                msg = actor + ' ' + this.note.verb + ' to join the group ' + this.note.object;
                break;
            default:
                msg = actor + ' ' + this.note.verb + ' ' + this.note.object;
            }
            return msg;

        }
    }

    return Base;
});
