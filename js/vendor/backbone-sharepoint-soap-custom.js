define(['underscore', 'backbone'],
    function(_, Backbone) {

        // SharePoint ListData service
        var LIST_SERVICE = '_vti_bin/Lists.asmx',
            url,
            SoapClient;

        // calculate url based on site
        url = function(options) {
            var site = options.site,
                // remove leading and trailing forward slashes from the site path
                path = site.replace(/^\/+|\/+$/g, ''),
                url = (path ? '/' + path : '') + '/' + LIST_SERVICE;

            return url;
        };

        SoapClient = {
            tpl: _.template(
                '<?xml version="1.0" encoding="utf-8"?>' +
                '<soap:Envelope ' +
                '  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" ' +
                '  xmlns:xsd="http://www.w3.org/2001/XMLSchema" ' +
                '  xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">' +
                '<soap:Body>' +
                '<<%= method %> xmlns="http://schemas.microsoft.com/sharepoint/soap/">' +
                '<listName><%= listName%></listName>' +
                '<%= params %>' +
                '</<%= method %>>' +
                '</soap:Body>' +
                '</soap:Envelope>'
            ),

            writeParams: function(itemID, changeSet, cmd) {
                xml = '<updates><Batch OnError="Continue">' +
                    '<Method ID="1" Cmd="' + cmd + '">' +
                    '<Field Name="ID">' + itemID + '</Field>';
                for (var key in changeSet) {
                    if (changeSet.hasOwnProperty(key)) {
                        console.log(key + ' is being set to ' + changeSet[key]);
                        xml += '<Field Name="' + key + '">' + changeSet[key] + '</Field>';
                    }
                }
                xml += '</Method>' +
                    '</Batch></updates>';
                return xml;
            },

            readParams: function(params) {
                var key, value, xml = '';

                params = params || {};

                for (key in params) {
                    value = params[key];
                    if (value) {
                        xml += '<' + key + '>';
                        switch (key) {
                            case 'viewFields':
                                // for future use...
                                break;
                            default:
                                xml += params[key];
                                break;
                        }

                        xml += '</' + key + '>';
                    }
                }
                console.log("Generated XML to read list");
                console.log(xml);
                return xml;
            },

            success: function(data, status, xhr, callback) {
                var nodes, node, rootnode, name,
                    NODE_ELEMENT = 1,
                    attributes, attribute,
                    results = [],
                    result,
                    root = 'data',
                    i, j;


                rootnode = data.querySelector(root);
                nodes = rootnode.childNodes;

                for (i = 0; i < nodes.length; i += 1) {
                    node = nodes[i];

                    // skip text nodes
                    if (node.nodeType === NODE_ELEMENT) {
                        attributes = node.attributes;
                        result = {};
                        for (j = 0; j < attributes.length; j += 1) {
                            attribute = attributes[j];
                            name = attribute.name.replace('ows_', '');
                            result[name] = attribute.value;
                        }
                        // only use the result if it is not hidden
                        if ((result.Hidden || '').toUpperCase() !== "TRUE") {
                            results.push(result);
                        }

                    }
                }

                // results now contains an Array of javascript objects.

                // call the success handler inside Collection.fetch() to process the results.
                if (callback) {
                    callback(results, status, xhr);
                }

            },


            call: function(config) {
                var me = this,
                    request;


                config = config || {};
                // prepare the Ajax request
                request = {
                    type: 'POST',
                    url: url({
                        site: config.site
                    }),
                    beforeSend: function(xhr) {
                        xhr.setRequestHeader("SOAPAction",
                            "http://schemas.microsoft.com/sharepoint/soap/" + config.method);
                    },
                    contentType: 'text/xml',
                    dataType: 'xml',
                    data: this.tpl({
                        method: config.method,
                        listName: config.listName,
                        params: config.method == 'GetListItems' ? this.readParams(config.params) : this.writeParams(config.itemID, config.changeSet, config.cmd)
                    }),
                    processData: false,
                    success: function(data, status, xhr) {
                        if (config.method == 'GetListItems') {
                            me.success(data, status, xhr, config.success)
                        }
                    },
                    error: config.error
                };

                // Make the request.
                return $.ajax(request);

            }
        };

        Backbone_SP = {};

        Backbone_SP.Item = Backbone.Model.extend({

            // the id attribute of a SharePoint item. Please note capital I
            idAttribute: 'ID',

            url: function() {
                var options = {
                    site: this.site,
                    list: this.list
                };

                if (!this.isNew()) {
                    options.id = this.id;
                }

                return url(options);
            },

            sync: function(method, model, options) {
                console.log(method);

                configMap = {

                    'create': {
                        method: 'UpdateListItems',
                        cmd: 'New',
                        changeSet: this.attributes
                    },
                    'read': {
                        method: 'GetListItems',
                        cmd: '',
                        changeSet: {}
                    },
                    'update': {
                        method: 'UpdateListItems',
                        cmd: 'Update',
                        changeSet: this.changedAttributes()
                    },
                    'delete': {
                        method: 'UpdateListItems',
                        cmd: 'Delete',
                        changeSet: {}
                    }
                };

                soapConfig = configMap[method];

                SoapClient.call({
                    site: this.site,
                    service: 'Lists',
                    method: soapConfig.method,
                    success: options.success,
                    error: options.error,
                    listName: this.list,
                    cmd: soapConfig.cmd,
                    itemID: this.id,
                    changeSet: soapConfig.changeSet,

                    params: {
                        viewName: this.view || '',
                    }
                });
            }
        });

        Backbone_SP.List = Backbone.Collection.extend({
            url: function() {
                return this.model.prototype.url();
            },

            sync: function(method, model, options) {
                _.extend(options, {
                    view: this.view
                });
                return this.model.prototype.sync(method, model, options);
            }

        });

        return Backbone_SP;
    });