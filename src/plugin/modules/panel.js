define([
    'kb_ko/lib/knockout-base',
    'kb_common/html',
    './components/feedViewer'
], function (
    KO,
    html,
    FeedViewerComponent
) {
    'use strict';

    var t = html.tag,
        div = t('div');

    function factory(config) {
        var runtime = config.runtime,
            hostNode, container;

        function attach(node) {
            hostNode = node;
            container = hostNode.appendChild(document.createElement('div'));
        }

        function start() {
            runtime.send('ui', 'setTitle', 'Feeds');
            container.innerHTML = div({
                dataBind: {
                    component: {
                        name: FeedViewerComponent.quotedName(),
                        params: {}
                    }
                }
            });
            KO.ko.applyBindings({}, container);
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