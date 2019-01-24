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

        entityHtml(e) {
            e.id = Util.cleanText(e.id);
            e.name = Util.cleanText(e.name);
            let msg = '';
            switch(e.type) {
            case 'user':
                if (e.name !== null) {
                    msg = `${e.name} (${this.userLink(e.id)})`;
                }
                else {
                    msg = this.userLink(e.id);
                }
                break;
            case 'group':
                msg = this.groupLink(e);
                break;
            case 'narrative':
                msg = this.narrativeLink(e);
                break;
            default:
                if (e.name !== null) {
                    msg = `${e.name} (${e.id})`;
                }
                else {
                    msg = e.id;
                }
                break;
            }
            return `<span class="feed-entity">${msg}</span>`;
        }

        narrativeLink(e) {
            return `<a href="narrative/${e.id}">${e.name ? e.name : e.id}</a>`;
        }

        groupLink(e) {
            return `<a href="#orgs/${e.id}">${(e.name ? e.name : e.id)}</a>`;
        }

        userLink(userId) {
            return `<a href="#people/${userId}">${userId}</a>`;
        }

        // actorHtml() {
        //     let actor = this.note.actor,
        //         actorId = Util.cleanText(actor.id),
        //         actorName = actor.name ? Util.cleanText(actor.name) : null,
        //         idHtml = this.userLink(actorId),
        //         actorHtml = '<span class="feed-entity">';

        //     if (actorName !== null) {
        //         actorHtml += `${actorName} (${idHtml})`;
        //     }
        //     else {
        //         actorHtml += `${idHtml}`;
        //     }
        //     return actorHtml + '</span>';
        // }

        buildHtml() {
            let actor = this.entityHtml(this.note.actor),
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
