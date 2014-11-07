define(['knockback'],
    function(kb) {
        var personViewModel = kb.ViewModel.extend({
            constructor: function(model) {
                //  required to make calls to kb.ViewModel base methods e.g. model()

                var self = this;
                kb.ViewModel.prototype.constructor.call(self, model, {});

                self.Title = kb.observable(model, {
                    key: 'Title'
                });

                self.deleteme = function() {
                    self.model().destroy();
                };

            }
        });

        return personViewModel;
    });