define(['./components/controller'], function (FeedController) {
    'use strict';

    function factory(config) {
        var runtime = config.runtime,
            hostNode,
            container;

        function attach(node) {
            hostNode = node;
            container = hostNode.appendChild(document.createElement('div'));
            container.classList.add('feeds-container');
        }

        function start() {
            runtime.send('ui', 'setTitle', 'Notification Feeds');
            new FeedController({
                runtime: runtime,
                element: container
            });
        }

        function stop() {
            container.innerHTML = 'stopping...';
        }

        function detach() {
            if (hostNode && container) {
                hostNode.removeChild(container);
            }
        }

        return {
            attach: attach,
            start: start,
            stop: stop,
            detach: detach
        };
    }

    return {
        make: function (config) {
            return factory(config);
        }
    };
});
