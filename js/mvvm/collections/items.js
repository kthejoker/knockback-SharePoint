define([
    'mvvm/models/item',
    'backbonesp'
], function(itemModel, Backbone_SP) {
    var collection = Backbone_SP.List.extend({
        model: itemModel
    });

    return new collection();
});