define([
    'jquery',
    'mvvm/collections/people',
    'mvvm/views/people',
    'knockout'
], function($, peopleCollection, peopleViewModel, ko) {


    var initialize = function() {

        ko.components.register('list-item', {
            require: 'mvvm/components/ListItem'
        });
        peopleCollection.fetch();
        people_view_model = new peopleViewModel(peopleCollection);

        $(document).ready(function() {
            ko.applyBindings(people_view_model);
        });

    }
    return {
        initialize: initialize
    }
});