define([
    'kb_common/html',
    './components/controller'
], function (
    html,
    FeedController
) {
    'use strict';

    var t = html.tag,
        div = t('div'),
        myFeed;

    function factory(config) {
        var runtime = config.runtime,
            hostNode,
            container,
            roles;

        function attach(node) {
            hostNode = node;
            container = hostNode.appendChild(document.createElement('div'));
            container.classList.add('feeds-container');
        }

        function start() {
            runtime.send('ui', 'setTitle', 'Notification Feeds');
            roles = runtime.service('session').getRoles();
            myFeed = new FeedController({
                runtime: runtime
            });
            container.appendChild(myFeed.element);
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