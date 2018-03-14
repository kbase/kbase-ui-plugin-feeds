define([], function () {
    'use strict';
    const feed = [{
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

    var sources = [{
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

    var targetTypes = [{
        id: 'narrative',
        label: 'Narratve',
        icon: 'file-o'
    }, {
        id: 'data',
        label: 'Data',
        icon: 'database'
    }];

    return {
        feed,
        sources,
        targetTypes
    };
});