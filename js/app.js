define([
    'jquery',
    'mvvm/collections/items',
    'mvvm/viewmodels/items',
    'knockout'
], function($, itemsCollection, itemsViewModel, ko) {


    var initialize = function() {

        ko.components.register('list-item', {
            require: 'mvvm/components/ListItem'
        });
        itemsCollection.fetch();
        vm = new itemsViewModel(itemsCollection);

        $(document).ready(function() {
            ko.applyBindings(vm);
        });

    }
    return {
        initialize: initialize
    }
});