define(function () {
    'use strict';
    function cleanText(text) {
        const n = document.createElement('div');
        n.textContent = text;
        return n.innerHTML;
    }

    return {
        cleanText: cleanText
    };
});