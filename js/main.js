require.config({
    baseUrl: 'js/vendor',
    paths: {
        jquery: 'jquery-1.11.1.min',
        backbone: 'backbone-min',
        knockback: 'knockback-core-min',
        knockout: 'knockout-3.2.0',
        backbonesp: 'backbone-sharepoint-soap-custom',
        app: '../app',
        mvvm: '../mvvm'
    },
    shim: {
        "underscore": {
            exports: "_"
        },
        "backbone": {
            'deps': ['underscore', 'jquery'],
            exports: "Backbone"
        },
        "knockback": {
            'deps': ['backbone', 'knockout']
        }
    }
});

require([
    'app'
], function(App) {
    return App.initialize();
});