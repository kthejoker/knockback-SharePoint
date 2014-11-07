knockback-SharePoint
====================

A working implementation of KnockBack.JS using a Sharepoint 2007 backend.

This project makes use of several popular Javascript libraries to give a demonstration of incorporating modern HTML5 standards and web development technologies to the enterprise's favorite legacy platform, SharePoint 2007.

Out of the box, SharePoint 2007 provides a "mobile" experience that was explicitly designed for the tiny dumbphone screens of yesteryear. Needless to say, we've come a long way in mobile design, client interfaces, and request-driven data infrastructure. To bring MOSS 2007 into 2014, we're making use of the following libraries:

* jQuery , the Swiss Army knife of Javascript: DOM maniplation, AJAX, tons of utility functions 
* Knockout , a Javascript MVVM pattern implementation with two-way bindings, dependency tracking, and a powerful custom component feature
* Backbone.js , a pretty beefy ORM implementation, including persistence, change tracking, and state of the art event handling
* Underscore.js , another large set of utility functions required by Backbone to do its thing
* Knockback.js , a library which combines Knockout and Backbone for a smooth(ish) DTO lifecycle (essentially fetch with Backbone, bind into Knockout and manipulate, sync back to Backbone)
* RequireJS , an AMD loader to ensure JavaScript dependencies are loaded when they're needed and no sooner
* ZURB Foundation, a pretty cool responsive design (I've taken the lame route and am only using their raw CSS, not all the cool SASS-driven features they have. Chill, it's just a demo.)


Backbone.Sharepoint.SOAP.Custom
====================

Finally, there is one custom library which I have forked from <a href='https://github.com/lstak/Backbone.SharePoint'>lstak's Backbone.Sharepoint</a> repository. 

Some context: Out of the box, Backbone.js assumes you have a standard REST interface for interfacing with your models, utilizing URLs and HTTP requests to manage each CRUD operation ("/items/1" to get an item with id 1, "/items/create" to create a new item, etc.) You're allowed to override a Backbone.Model and Backbone.Collection's <b>sync</b> method with your own custom method, and lstak wrote a complete implementation of Sharepoint 2010 and 2013's OData protocols for getting and modifying list items.

However, Sharepoint 2007 only offers a SOAP protocol rather than OData for interfacing with lists, and lstak's repository has a "read entire rec9list/view" implementation in SOAP and one great big honking TODO for everything else. So I forked his Backbone Sharepoint for SOAP implementation and extended it to full CRUD. That said, there are still some major TODOs in this new code:

* Read is still "get all items from a list", even when passed a specific item ID
* Similarly, no CAML Where clauses or ViewFields to limit result sets
* No batching of commands to reduce HTTP load - each command is a "batch of one"
* General cleanup of configuration and parameters and performance - I don't live and breathe JavaScript, so when things work I stop touching them.

So the final dependency chain looks something like:

* Index.html uses a Knockout binding with a custom element (<pre>&lt;list-item&gt;</pre>) in a foreach loop to print each list item.
* The foreach loop ooperates on a Knockback ViewModel
* Which is pretty much just a thin service layer for a Knockback collectionObservable
* Which is a spiffy glue object between 
* a Knockout observableArray (for UI binding) 
* and a BackboneSP List (for data layer communication and change tracking)
* Which is actually a custom extension of a Backbone.Collection for Sharepoint 2007 lists with SOAP-specific syncing methods for handling CRUD operations and parsing results back into the Backbone.Models
* Which uses jQuery as the library of choice for handling AJAX requests
* All of which is managed at load time by RequireJS

And amazingly it works! I honestly have no idea if the save methodology I've implemented is Backbone best practices or not, but you know what? Nobody ever actually rigs up a full CRUD Backbone demo! So I'm charting new territory here.

Usage
====================

<ol>
<li>Copy all code out to a folder on your Sharepoint site.</li>
<li>In <i>js/mvvm/models/item.js</i>:
<ol>
<li>Set the <i>site</i> property to the relative site URL your list is on. I recommend just using a root URL ("/Subsite/Subsubsite") for portabililty</li>
<li>Set the <i>list</i> property to your list name (N.B. this might not be the displayed list title, check your properties if you get a No such List 500 error from your SOAP call.)</li>
<li>This list should have a <i>Title</i> attribute for the demo to properly work (lists come with this by default, so hopefully we're all good here.)</li>
</ol>
<li>There is no step 3.</li>
</ol>

Navigate to index.html in your deployed folder and you should see a row for each item in your list that has a textbox containing the Title and a Delete button.

Customization
====================

* Add additional attributes from your list item type to the kb.ViewModel constructor in <i>js/mvvm/viewmodels/item.js</i>.
* Modify the <i>js/mvvm/components/list-item-template.html</i> to affect how each list item is presented on the page.
* Consider more interesting knockout bindings like <pre>event</pre>, <pre>options</pre>, and <pre>if/visible</pre>. Or custom bindings!
* Build another custom component for just displaying the title, and use an <pre>if</pre> binding and a boolean to flip between the editor and the display components.
* Consider implementing Backbone-Relational for an even more ORM-style data layer (relational models in SharePoint = never not a terrible idea, but well, here you are)
* Upgrade to Sharepoint Online! Oh, wait.







