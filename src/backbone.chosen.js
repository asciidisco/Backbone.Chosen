(function (root, define, require, exports, module, factory, undef) {
    'use strict';
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory(require('underscore'), require('backbone'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['underscore', 'backbone'], function (_, Backbone) {
            // Check if we use the AMD branch of Backbone
            _ = _ === undef ? root._ : _;
            Backbone = Backbone === undef ? root.Backbone : Backbone;
            return (root.returnExportsGlobal = factory(_, Backbone, root));
        });
    } else {
        // Browser globals
        root.returnExportsGlobal = factory(root._, root.Backbone);
    }

// Usage:
//
// Note: This plugin is UMD compatible, you can use it in node, amd and vanilla js envs
//
// Vanilla JS:
// <script src="underscore.js"></script>
// <script src="backbone.js"></script>
// <script src="backbone.chosen.js"></script>
//
// Node:
// var _ = require('underscore');
// var Backbone = require('backbone');
// var Chosen = require('backbone.chosen');
//
// AMD:
// define(['underscore', 'backbone', 'backbone.chosen'], function (_, Backbone, Chosen) {
//    // insert sample from below
//    return User;
// });

}(this, this.define, this.require, this.exports, this.module, function (_, Backbone, root, undef) {
    'use strict';
    
    // check if we use the amd branch of backbone and underscore
    Backbone = (Backbone === undef || Backbone === null) ? root.Backbone : Backbone;
    _ = (_ === undef || _ === null) ? root._ : _;

    // extend backbones model prototype with the mutator functionality
    var Chosen     = function () {},
        oldPrepare  = Backbone.Collection.prototype._prepareModel,
        mapModels = null;

    // map models based on the given attribute
    mapModels = function (options, model) {
        var attr = model[options.attr],
            mappedModel = options.defaults;

        if (options.attr.search('.') !== -1) {
            var mappedAttribute = model,
                attributes = options.attr.split('.');
            _.each(attributes, function (attribute, key) {
                mappedAttribute = mappedAttribute[attribute];
                if (key === (attributes.length - 1)) {
                    attr = mappedAttribute;
                }
            });
        }

        _.each(options.map, function (modelRaw, key) {
            if (key === attr) {
                mappedModel = modelRaw;
            }
        });

        return mappedModel;
    };

    Chosen.prototype._prepareModel = function (model, options) {
      var modelSkeleton = this.model,
          oldCollection = _.clone(this);

      options = options || {};

      if (_.isObject(modelSkeleton) && modelSkeleton.chosen !== undef) {

        if (_.isFunction(modelSkeleton.chosen)) {
            oldCollection.model = modelSkeleton.chosen(model);
        } else {
            // check chosen map args
            // check default model skeleton
            if ((modelSkeleton.chosen.defaults.prototype instanceof Backbone.Model) === false) {
                throw "Backbone.Chosen Error: defaults property must be of type Backbone.Model";
            }

            // check map property
            if (_.isObject(modelSkeleton.chosen.map) === false) {
                throw "Backbone.Chosen Error: map property must be an object literal";
            } else {
                _.each(modelSkeleton.chosen.map, function (modelRaw, key) {
                    if ((modelRaw.prototype instanceof Backbone.Model) === false) {
                        throw "Backbone.Chosen Error: map property values must be of type Backbone.Model";
                    }
                });
            }

            // check attr property
            if (_.isString(modelSkeleton.chosen.attr) === false) {
                throw "Backbone.Chosen Error: attr property must be a string";
            }

            oldCollection.model = mapModels(modelSkeleton.chosen, model);
        }
      }

        return _.bind(oldPrepare, oldCollection)(model, options);
    };

    // go out in to the wild my little helper
    Backbone.Chosen = Chosen;
    _.extend(Backbone.Collection.prototype, Chosen.prototype);
    return Chosen;
}));