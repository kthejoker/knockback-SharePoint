define(['backbonesp'],
    function(Backbone_SP) {
        var model = Backbone_SP.Item.extend({
            site: '/it/mobiletesting',
            list: 'TestList',
        });

        return model;
    }
);