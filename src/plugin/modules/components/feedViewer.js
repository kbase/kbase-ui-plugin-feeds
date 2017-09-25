// A very basic starter display for feeds.
define([
    'bluebird',
    'knockout-plus',
    'kb_common/html'
], function (
    Promise,
    ko,
    html
) {
    'use strict';

    var t = html.tag,
        div = t('div'),
        p = t('p'),
        span = t('span'),
        h3 = t('h3'),
        label = t('label'),
        input = t('input'),
        ul = t('ul'),
        li = t('li'),
        a = t('a');

    var sampleFeedSources = [{
        id: 'ke',
        title: 'Knowledge Engine',
        icon: 'connecteddevelop'
    }, {
        id: 'appjob',
        title: 'App Cell Job',
        icon: 'bolt'
    }, {
        id: 'importjob',
        title: 'Import Job',
        icon: 'upload'
    }, {
        id: 'share',
        title: 'Share',
        icon: 'share-alt'
    }];

    var sampleTargetTypes = [{
        id: 'narrative',
        label: 'Narratve',
        icon: 'file-o'
    }, {
        id: 'data',
        label: 'Data',
        icon: 'database'
    }];

    var sampleFeed = [{
        id: '1',
        source: 'ke',
        message: 'A user has published an updated Genome that was used in the Narrative "Expression Analysis of three strains of Rhodobacter"',
        type: 'info',
        date: '2017-09-22T13:08:14.728Z',
        read: false,
        links: [{
            path: '/narrative/ws.26258.obj.1',
            title: 'Expression Analysis of three strains of Rhodobacter'
        }, {
            path: '#dataview/26258/5/1',
            title: 'Rhodobacter sphaeroides 2.4.1'
        }]
    }, {
        id: '2',
        source: 'ke',
        message: 'The consensus functional role of a gene of interest in Narrative "Expression Analysis of three strains of Rhodobacter" may be of interest.',
        type: 'info',
        date: '2017-09-22T13:11:36.221Z',
        read: false,
        links: [{
            path: '/narrative/ws.26258.obj.1',
            title: 'Expression Analysis of three strains of Rhodobacter'
        }, {
            path: '#dataview/26258/3/1',
            title: 'Rhodobacter aestuarii JA296'
        }]
    }, {
        id: '3',
        source: 'appjob',
        message: 'Job Completed: Spades Assembly Finished in Narrative "Assembly and Annotation"',
        type: 'success',
        date: '2017-09-22T13:13:29.842Z',
        read: false,
        links: [{
            path: '/narrative/ws.26258.obj.1',
            title: 'Assembly and Annotation'
        }, {
            path: '#dataview/26258/7/1',
            title: 'Rhodobacter megalophilus DSM 18937'
        }]
    }, {
        id: '4',
        source: 'appjob',
        message: 'Job Failed: Prokka Annotation failed in Narrative: "Assembly and Annotation"',
        type: 'error',
        date: '2017-09-22T13:14:31.688Z',
        read: false,
        links: [{
            path: '/narrative/ws.26258.obj.1',
            title: 'Assembly and Annotation'
        }]
    }, {
        id: '5',
        source: 'share',
        message: 'User "aparkin" has shared Narrative: "Demo Narrative for Feeds Prototype Feature" with you',
        type: 'info',
        date: '2017-09-22T13:15:42.860Z',
        read: false,
        links: [{
            path: '/narrative/ws.26258.obj.1',
            title: 'Demo Narrative for Feeds Prototype Feature'
        }, {
            path: '#people/aparkin',
            title: 'Adam Arkin'
        }]
    }, {
        id: '6',
        source: 'narr',
        message: 'A Narrative you created 3 days ago has not yet been saved.',
        type: 'warning',
        date: '2017-09-22T13:15:42.860Z',
        read: false,
        links: [{
            path: '/narrative/ws.26258.obj.1',
            title: 'Demo Narrative for Feeds Prototype Feature'
        }]
    }];

    var messageTypes = [{
        name: 'info',
        colorClass: 'bg-info',
        iconClass: 'info'
    }, {
        name: 'warning',
        colorClass: 'bg-warning',
        iconClass: 'exclamation'
    }, {
        name: 'success',
        colorClass: 'bg-success',
        iconClass: 'check'
    }, {
        name: 'error',
        colorClass: 'bg-danger',
        iconClass: 'exclamation-triangle'
    }];

    function viewModel(params) {
        function fetchTargetTypes() {
            return Promise.try(function () {
                return sampleTargetTypes;
            });
        }

        function fetchSources() {
            return Promise.try(function () {
                return sampleFeedSources;
            });
        }

        function fetchFeed() {
            return Promise.try(function () {
                return sampleFeed;
            });
        }

        var messageTypesMap = messageTypes.reduce(function (map, item) {
            map[item.name] = item;
            return map;
        }, {});

        var targetTypes;
        var feedSources;
        var feed = ko.observableArray();

        var isLoading = ko.observable(false);
        var error = ko.observable();

        var viewTypes = {
            info: ko.observable(true),
            success: ko.observable(true),
            warning: ko.observable(true),
            error: ko.observable(true)
        };

        var filterText = ko.observable().extend({
            throttle: 100
        });

        // function getRowClass(item) {
        //     switch (item.type) {
        //     case 'info':
        //         return 'info';
        //     case 'success':
        //         return 'success';
        //     case 'warning':
        //         return 'warning';
        //     case 'error':
        //         return 'danger';
        //     default:
        //         return '';
        //     }
        // }

        // function getRowClasses(item) {
        //     var classes = {};
        //     classes[getRowClass(item)] = true;
        //     return classes;
        // }

        function createFeedItem(item) {
            var newItem = JSON.parse(JSON.stringify(item));
            newItem.read = ko.observable(newItem.read);
            newItem.selected = ko.observable(false);
            newItem.messageType = messageTypesMap[newItem.type];
            return newItem;
        }

        function updateFeed() {
            fetchFeed()
                .then(function (newFeed) {
                    var ofeed = newFeed.map(function (item) {
                        return createFeedItem(item);
                    }).filter(function (item) {
                        if (!viewTypes.info()) {
                            if (item.type === 'info') {
                                return false;
                            }
                        }
                        if (!viewTypes.success()) {
                            if (item.type === 'success') {
                                return false;
                            }
                        }
                        if (!viewTypes.error()) {
                            if (item.type === 'error') {
                                return false;
                            }
                        }
                        if (!viewTypes.warning()) {
                            if (item.type === 'warning') {
                                return false;
                            }
                        }
                        if (filterText() && filterText().length > 0) {
                            var re = new RegExp(filterText(), 'i');
                            if (!re.test(item.message)) {
                                return false;
                            }
                        }
                        return true;
                    });
                    feed(ofeed);
                });
        }
        viewTypes.info.subscribe(function () {
            updateFeed();
        });
        viewTypes.success.subscribe(function () {
            updateFeed();
        });
        viewTypes.warning.subscribe(function () {
            updateFeed();
        });
        viewTypes.error.subscribe(function () {
            updateFeed();
        });
        filterText.subscribe(function () {
            updateFeed();
        });

        function start() {
            isLoading(true);
            return Promise.all([
                    fetchTargetTypes(),
                    fetchSources(),
                    fetchFeed()
                ])
                .spread(function (newTypes, newSources, newFeed) {
                    targetTypes = newTypes;
                    feedSources = newSources;

                    var ofeed = newFeed.map(function (item) {
                        return createFeedItem(item);
                    });
                    feed(ofeed);
                })
                .catch(function (err) {
                    console.error('error', err);
                    error(err.message);
                })
                .finally(function () {
                    isLoading(false);
                });
        }

        var selectedMessage = ko.observable();

        function doSelectMessage(data) {
            data.read(true);
            if (selectedMessage()) {
                // otherwise unselect the existing message
                selectedMessage().selected(false);
                // unselect if already selected
                if (selectedMessage() === data) {
                    selectedMessage(null);
                    return;
                }
            }
            data.selected(true);
            selectedMessage(data);
        }

        function doMessageAction(data) {
            window.open(data.path);
            // window.location.href = data.path;
        }

        start();

        var timer;

        function startRandomInserter() {
            function insertOne() {
                var index = Math.floor(Math.random() * sampleFeed.length);
                var item = JSON.parse(JSON.stringify(sampleFeed[index]));
                item.date = new Date();
                feed.unshift(createFeedItem(item));
            }
            var interval = Math.ceil(Math.random() * 15000);
            timer = window.setTimeout(function () {
                insertOne();
                startRandomInserter();
            }, interval);
        }
        // startRandomInserter();

        function dispose() {
            if (timer) {
                window.clearTimeout(timer);
            }
        }

        function doRead(data) {
            if (!data.read()) {
                data.read(true);
            }
        }

        return {
            feed: feed,
            isLoading: isLoading,
            error: error,
            doSelectMessage: doSelectMessage,
            selectedMessage: selectedMessage,
            doMessageAction: doMessageAction,
            doRead: doRead,
            dispose: dispose,
            viewTypes: viewTypes,
            filterText: filterText
        };
    }

    function buildFeedTableHeader() {
        return div({
            class: '-row -header'
        }, [

            div({
                class: '-col',
                style: {
                    width: '5%',
                    textAlign: 'center'
                }
            }),
            div({
                class: '-col',
                style: {
                    width: '5%',
                    textAlign: 'center'
                }
            }, 'Read'),
            div({
                class: '-col',
                style: {
                    width: '15%'
                }
            }, 'Date'),
            div({
                class: '-col',
                style: {
                    width: '15%'
                }
            }, 'Source'),

            div({
                class: '-col',
                style: {
                    width: '60%'
                }
            }, 'Message')
        ]);
    }

    function buildFeedDetail() {
        return [
            '<!-- ko if: selected -->',
            div({
                class: '-detail'
            }, [
                // div({
                //     dataBind: {
                //         text: 'source'
                //     }
                // }),
                p({
                    dataBind: {
                        text: 'message'
                    }
                }),
                div({}, [
                    div({
                        style: {
                            fontWeight: 'bold'
                        }
                    }, 'Links'),
                    ul({
                        dataBind: {
                            foreach: 'links'
                        }
                    }, li(a({
                        dataBind: {
                            text: 'title',
                            click: '$component.doMessageAction'
                        }
                    })))
                ])
            ]),
            '<!-- /ko -->'
        ];
    }

    function buildFeedTableRow() {
        return div({
            class: '-row -item',
            dataBind: {
                css: {
                    '-selected': 'selected'
                }
            }
        }, [
            div({
                class: '-col',
                style: {
                    width: '5%',
                    textAlign: 'center'
                },
                dataBind: {
                    css: 'messageType.colorClass',
                    style: {
                        fontWeight: 'read() ? "bold" : "normal"'
                    }
                }
            }, span({
                dataBind: {
                    css: '"fa-" + messageType.iconClass',
                },
                class: 'fa',

            })),
            div({
                class: '-col -read',
                style: {
                    width: '5%',
                    textAlign: 'center'
                },
                dataBind: {
                    ifnot: 'read',
                    style: {
                        cursor: 'read() ? "normal" : "pointer"',
                    },
                    css: {
                        '-is-read': 'read()'
                    },
                    click: '$component.doRead'
                }
            }, '*'),
            div({
                class: '-col -date',
                style: {
                    width: '15%'
                },
                dataBind: {
                    typedText: {
                        type: '"date"',
                        value: 'date',
                        format: '"MM/DD/YYYY HH:mm:ss"'
                    }
                }
            }),
            div({
                class: '-col -source',
                style: {
                    width: '5%'
                },
                dataBind: {
                    text: 'source'
                }
            }),

            div({
                class: '-col -message',
                style: {
                    width: '70%'
                },
                dataBind: {
                    text: 'message',
                    click: '$component.doSelectMessage'
                }
            })
        ]);
    }

    function buildFeedTable() {
        return div({
            style: {
                width: '100%'
            },
            class: '-feed'
        }, [
            buildFeedTableHeader(),
            '<!-- ko if: feed().length > 0 -->',
            '<!-- ko foreach: feed -->',
            div({
                class: '-row',

            }, [
                buildFeedTableRow(),
                buildFeedDetail()
            ]),
            '<!-- /ko -->',
            '<!-- /ko -->',
            '<!-- ko if: feed().length === 0 -->',
            p({
                style: {
                    textAlign: 'center',
                    margin: '10px',
                    color: 'red'
                }
            }, 'Sorry, No Feed messages found'),
            '<!-- /ko -->',
        ]);
    }

    function buildFeedViewer() {
        return [
            '<!-- ko if: selectedMessage -->',
            div({
                dataBind: {
                    with: 'selectedMessage'
                },
                style: {
                    border: '1px silver solid',
                    margin: '4px',
                    padding: '4px'
                }
            }, [
                div({
                    dataBind: {
                        text: 'source'
                    }
                }),
                div({
                    class: '-message',
                    dataBind: {
                        text: 'message'
                    }
                }),
                div({}, [
                    div({
                        style: {
                            fontWeight: 'bold'
                        }
                    }, 'Links'),
                    ul({
                        dataBind: {
                            foreach: 'links'
                        }
                    }, li(a({
                        dataBind: {
                            text: 'title',
                            click: '$component.doMessageAction'
                        }
                    })))
                ])
            ]),
            '<!-- /ko -->',
            '<!-- ko ifnot: selectedMessage -->',
            'select a message on the left',
            '<!-- /ko -->'
        ];
    }

    function buildFeedView() {
        return div({
            class: 'container-fluid component_feeds_feed-viewer'
        }, [
            // div({
            //     class: 'row'
            // }, div({
            //     class: 'col-sm-12'
            // }, [
            //     h3('Your Feed from KBase Services')
            // ])),
            div({
                class: 'row'
            }, [
                div({
                    class: 'col-sm-12'
                }, buildFeedTable())
                // div({
                //     class: 'col-sm-6'
                // }, buildFeedViewer())
            ])

        ]);
    }

    function buildFeedControls() {
        return div({
            class: 'form-inline',
            style: {
                height: '50px',
                textAlign: 'center'
            }
        }, [
            'Filter messages: ',
            div({
                class: 'checkbox'
            }, label([
                input({
                    type: 'checkbox',
                    dataBind: {
                        checked: 'viewTypes.info'
                    }
                }), 'Info'
            ])),
            div({
                class: 'checkbox'
            }, label([
                input({
                    type: 'checkbox',
                    dataBind: {
                        checked: 'viewTypes.success'
                    }
                }), 'Success'
            ])),
            div({
                class: 'checkbox'
            }, label([
                input({
                    type: 'checkbox',
                    dataBind: {
                        checked: 'viewTypes.warning'
                    }
                }), 'Warning'
            ])),
            div({
                class: 'checkbox'
            }, label([
                input({
                    type: 'checkbox',
                    dataBind: {
                        checked: 'viewTypes.error'
                    }
                }), 'Error'
            ])),
            div({
                class: 'form-group',
            }, input({
                class: 'form-control',
                placeholder: 'filter messages',
                dataBind: {
                    textInput: 'filterText'
                }
            }))
        ]);
    }

    function template() {
        return div({
            class: 'component_feeds_feed-viewer'
        }, [
            '<!-- ko if: error -->',
            div({
                dataBind: {
                    text: 'error'
                }
            }),
            '<!-- /ko -->',
            '<!-- ko ifnot: error -->',
            buildFeedControls(),
            buildFeedView(),
            '<!-- /ko -->'
        ]);
    }

    function component() {
        return {
            viewModel: viewModel,
            template: template()
        };
    }

    return component;
});