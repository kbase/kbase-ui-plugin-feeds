define([
    '../util',
    './icons'
], function (
    Util,
    Icons
) {
    'use strict';

    class Base {
        constructor(note, currentUserId) {
            this.currentUserId = currentUserId;
            this.note = note;
        }

        /**
         * This converts an Entity to an HTML string.
         * @param {object} e - an Entity - has keys id, name, type, all strings. Type can be one
         * of user, group, workspace, or narrative.
         */
        entityHtml(e) {
            let id = Util.cleanText(e.id),
                name = Util.cleanText(e.name),
                msg = '',
                icon = Icons.entity(e.type);
            switch(e.type) {
            case 'user':
                msg = this.userLink(id, name);
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
            return `<span class="feed-entity">${icon} ${msg}</span>`;
        }

        narrativeLink(id, name) {
            name = name || id;
            return `<a href="narrative/${id}">${name}</a>`;
        }

        groupLink(id, name) {
            name = name || id;
            return `<a href="#orgs/${id}">${name}</a>`;
        }

        userLink(userId, name) {
            let viewString = name ? name : userId;
            if (userId === this.currentUserId) {
                viewString += ' (you)';
            }
            return `<a href="#people/${userId}">${viewString}</a>`;
        }

        buildHtml() {
            return new Promise((resolve) => {
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
                resolve(msg);
            });
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
