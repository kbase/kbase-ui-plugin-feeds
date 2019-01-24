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
            let id = Util.cleanText(e.id),
                name = Util.cleanText(e.name);
            let msg = '';
            switch(e.type) {
            case 'user':
                if (name !== null) {
                    msg = `${name} (${this.userLink(id)})`;
                }
                else {
                    msg = this.userLink(id);
                }
                break;
            case 'group':
                msg = this.groupLink(id, name);
                break;
            case 'workspace':
            case 'narrative':
                msg = this.narrativeLink(id, name);
                if (!name) {
                    msg += ' (name not accessible)';
                }
                break;
            default:
                if (name !== null) {
                    msg = `${name} (${id})`;
                }
                else {
                    msg = id;
                }
                break;
            }
            return `<span class="feed-entity">${msg}</span>`;
        }

        narrativeLink(id, name) {
            name = name || id;
            return `<a href="narrative/${id}">${name}</a>`;
        }

        groupLink(id, name) {
            name = name || id;
            return `<a href="#orgs/${id}">${name}</a>`;
        }

        userLink(userId) {
            return `<a href="#people/${userId}">${userId}</a>`;
        }

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
