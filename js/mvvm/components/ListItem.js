define(["knockout", "text!./list-item-template.html"], function(ko, htmlString) { 

var ListItemComponent = function(params) {

console.log('Initiating knockout component');
  self.ListItem = params.ListItem;

  self.deleteMe = function() {
  	alert('deleting listitem');
  	self.ListItem.deleteme();
  }

};

return { viewModel: ListItemComponent, template: htmlString };

});