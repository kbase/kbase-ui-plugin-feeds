// A very basic starter display for feeds.
define([
    'bluebird',
    'kb_ko/lib/knockout-base',
    'kb_ko/lib/viewModelBase',
    'kb_common/html',
    '../sampleData',

    'css!./feedViewer.css'
], function (
    Promise,
    KO,
    ViewModelBase,
    html,
    sampleData
) {
    'use strict';

    var t = html.tag,
        div = t('div'),
        p = t('p'),
        span = t('span'),
        label = t('label'),
        input = t('input'),
        ul = t('ul'),
        li = t('li'),
        a = t('a');

    var sampleFeed = sampleData.feed;

    var sampleFeedSources = sampleData.sources;

    var sampleTargetTypes = sampleData.targetTypes;

    // var messageTypes = sampleData.messageTypes

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

    // function buildFeedViewer() {
    //     return [
    //         '<!-- ko if: selectedMessage -->',
    //         div({
    //             dataBind: {
    //                 with: 'selectedMessage'
    //             },
    //             style: {
    //                 border: '1px silver solid',
    //                 margin: '4px',
    //                 padding: '4px'
    //             }
    //         }, [
    //             div({
    //                 dataBind: {
    //                     text: 'source'
    //                 }
    //             }),
    //             div({
    //                 class: '-message',
    //                 dataBind: {
    //                     text: 'message'
    //                 }
    //             }),
    //             div({}, [
    //                 div({
    //                     style: {
    //                         fontWeight: 'bold'
    //                     }
    //                 }, 'Links'),
    //                 ul({
    //                     dataBind: {
    //                         foreach: 'links'
    //                     }
    //                 }, li(a({
    //                     dataBind: {
    //                         text: 'title',
    //                         click: '$component.doMessageAction'
    //                     }
    //                 })))
    //             ])
    //         ]),
    //         '<!-- /ko -->',
    //         '<!-- ko ifnot: selectedMessage -->',
    //         'select a message on the left',
    //         '<!-- /ko -->'
    //     ];
    // }

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


    class FeedViewerViewModel extends ViewModelBase {
        constructor() {
            super();
            // TODO move to superclass??

            this.feed = this.observableArray();
            this.isLoading = this.observableArray();
            this.error = this.observable();
            this.viewTypes = {
                info: this.observable(true),
                success: this.observable(true),
                warning: this.observable(true),
                error: this.observable(true)
            };
            this.filterText = this.observable().extend({
                throttle: 100
            });
            this.selectedMessage = this.observable();

            this.messageTypesMap = messageTypes.reduce((map, item) => {
                map[item.name] = item;
                return map;
            }, {});

            // Subscriptions
            // TODO: dispose them.

            this.subscribe(this.viewTypes.info, () => {
                this.updateFeed();
            });
            this.subscribe(this.viewTypes.success, () => {
                this.updateFeed();
            });
            this.subscribe(this.viewTypes.warning, () => {
                this.updateFeed();
            });
            this.subscribe(this.viewTypes.error, () => {
                this.updateFeed();
            });
            this.subscribe(this.filterText, () => {
                this.updateFeed();
            });

            // this.viewTypes.success.subscribe(() => {
            //     this.updateFeed();
            // });
            // this.viewTypes.warning.subscribe(() => {
            //     this.updateFeed();
            // });
            // this.viewTypes.error.subscribe(() => {
            //     this.updateFeed();
            // });
            // this.filterText.subscribe(() => {
            //     this.updateFeed();
            // });

            this.start();
        }

       

        fetchTargetTypes() {
            return Promise.try(function () {
                return sampleTargetTypes;
            });
        }

        fetchSources() {
            return Promise.try(function () {
                return sampleFeedSources;
            });
        }

        fetchFeed() {
            return Promise.try(function () {
                return sampleFeed;
            });
        }

        createFeedItem(item) {
            var newItem = JSON.parse(JSON.stringify(item));
            newItem.read = this.observable(newItem.read);
            newItem.selected = this.observable(false);
            newItem.messageType = this.messageTypesMap[newItem.type];
            return newItem;
        }

        updateFeed() {
            this.fetchFeed()
                .then((newFeed) => {
                    var ofeed = newFeed.map((item) => {
                        return this.createFeedItem(item);
                    }).filter((item) => {
                        if (!this.viewTypes.info()) {
                            if (item.type === 'info') {
                                return false;
                            }
                        }
                        if (!this.viewTypes.success()) {
                            if (item.type === 'success') {
                                return false;
                            }
                        }
                        if (!this.viewTypes.error()) {
                            if (item.type === 'error') {
                                return false;
                            }
                        }
                        if (!this.viewTypes.warning()) {
                            if (item.type === 'warning') {
                                return false;
                            }
                        }
                        if (this.filterText() && this.filterText().length > 0) {
                            var re = new RegExp(this.filterText(), 'i');
                            if (!re.test(item.message)) {
                                return false;
                            }
                        }
                        return true;
                    });
                    this.feed(ofeed);
                });
        }

        start() {
            this.isLoading(true);
            return Promise.all([
                this.fetchTargetTypes(),
                this.fetchSources(),
                this.fetchFeed()
            ])
                .spread((newTypes, newSources, newFeed) => {
                    this.targetTypes = newTypes;
                    this.feedSources = newSources;

                    var ofeed = newFeed.map((item) => {
                        return this.createFeedItem(item);
                    });
                    this.feed(ofeed);
                })
                .catch((err) => {
                    console.error('error', err);
                    this.error(err.message);
                })
                .finally(() => {
                    this.isLoading(false);
                });
        }

        doSelectMessage(data) {
            data.read(true);
            if (this.selectedMessage()) {
                // otherwise unselect the existing message
                this.selectedMessage().selected(false);
                // unselect if already selected
                if (this.selectedMessage() === data) {
                    this.selectedMessage(null);
                    return;
                }
            }
            data.selected(true);
            this.selectedMessage(data);
        }

        doMessageAction(data) {
            window.open(data.path);
            // window.location.href = data.path;
        }

        doRead(data) {
            if (!data.read()) {
                data.read(true);
            }
        }
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
            viewModel: FeedViewerViewModel,
            template: template()
        };
    }

    return KO.registerComponent(component);
});