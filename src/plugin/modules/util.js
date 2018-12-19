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

    return {
        cleanText: cleanText,
        loadingElement: loadingElement
    };
});
