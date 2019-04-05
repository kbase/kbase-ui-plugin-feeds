define(function () {
    'use strict';
    function cleanText(text) {
        const n = document.createElement('div');
        n.textContent = text;
        return n.innerHTML;
    }

    /**
     * Just makes and returns an i DOM node with a FontAwesome spinning
     * CSS icon in it.
     * @param {string} size - how big the spinner icon should be. Can be 1x-5x etc. Default=1x, all other values go to default.
     */
    function loadingElement(size) {
        size = size.toLocaleLowerCase();
        const defaultSize = '1x';
        if (!['1x', '2x', '3x', '4x', '5x'].includes(size)) {
            size = defaultSize;
        }
        let elem = document.createElement('i');
        elem.classList.add('fa', 'fa-spinner', 'fa-pulse', 'fa-' + size, 'fa-fw');
        return elem;
    }

    /**
     * Converts JS Date object to <time unit> ago.
     * Like "29 seconds ago" or whatever.
     * @param {Date} date - a Date object
     */
    const dateFilter = [{
        'div': 86400000,
        'interval': ' day'
    }, {
        'div': 3600000,
        'interval': ' hour'
    }, {
        'div': 60000,
        'interval': ' minute'
    }, {
        'div': 1000,
        'interval': ' second'
    }];

    function dateToAgo(date) {
        let now = new Date(),
            diffMs = Math.abs(now - date),
            diff;
        if (now < date) {
            return 'just now';
        }
        for (let i=0; i<dateFilter.length; i++) {
            diff = Math.floor(diffMs / dateFilter[i].div);
            if (diff > 0) {
                let s = (diff > 1) ? 's' : '';
                return diff + dateFilter[i].interval + s + ' ago';
            }
        }
        return 'just now';
    }

    return {
        cleanText: cleanText,
        loadingElement: loadingElement,
        dateToAgo: dateToAgo
    };
});
