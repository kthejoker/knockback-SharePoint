define([
        'knockback',
        'mvvm/viewmodels/item'
    ],
    function(kb, viewModel) {
        var collectionViewModel = kb.ViewModel.extend({
            constructor: function(collection) {

                var self = this;

                self.collection = kb.collectionObservable(collection, {
                    view_model: viewModel
                });

                self.save = function() {
                    self.collection.collection().each(function(model) {
                        if (model.hasChanged()) {
                            console.log("Changed Attributes");
                            console.log(model.changedAttributes());
                            model.save();
                        }
                    });
                };

                self.create = function() {
                    self.collection.collection().create({
                        Title: "New Item"
                    });
                };

            }
        });

        return collectionViewModel;
    });