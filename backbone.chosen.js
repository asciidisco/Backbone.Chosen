/*! Backbone.Chosen - v0.1.1
------------------------------
Build @ 2012-05-24
Documentation and Full License Available at:
http://asciidisco.github.com/Backbone.Chosen/index.html
git://github.com/asciidisco/Backbone.Chosen.git
Copyright (c) 2012 Sebastian Golasch <public@asciidisco.com>

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the

Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
IN THE SOFTWARE.*/

(function umdDefine (root, define, require, exports, module, factory, undef) {
    'use strict';
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory(require('underscore'), require('backbone'));
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['underscore', 'backbone'], function amdDefine (_, Backbone) {
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

}(this, this.define, this.require, this.exports, this.module, function chosenBody (_, Backbone, root, undef) {
    'use strict';

    // store Backbones prepareModel method, because it will be overriden
    var Chosen      = function () {},
        oldPrepare  = Backbone.Collection.prototype._prepareModel,
        mapModels   = null;

    // map models based on the given attribute
    mapModels = function (options, model) {
        var attr = model[options.attr],
            mappedModel = options.defaults;

        if (options.attr.search('.') !== -1) {
            var mappedAttribute = model,
                attributes = options.attr.split('.');
            _.each(attributes, function attributesIterator (attribute, key) {
                mappedAttribute = mappedAttribute[attribute];
                if (key === (attributes.length - 1)) {
                    attr = mappedAttribute;
                }
            });
        }

        _.each(options.map, function modelMapIterator (modelRaw, key) {
            if (key === attr) {
                mappedModel = modelRaw;
            }
        });

        return mappedModel;
    };

    // 
    Chosen.prototype._prepareModel = function (model, options) {
      var modelSkeleton = this.model,
          oldCollection = _.clone(this),
          chosenError   = 'Backbone.Chosen Error: ';

      if (_.isObject(modelSkeleton) && modelSkeleton.chosen !== undef) {

        if (_.isFunction(modelSkeleton.chosen)) {
            oldCollection.model = modelSkeleton.chosen(model);
        } else {
            // check if default property is set
            if (modelSkeleton.chosen.defaults === undef) {
                throw chosenError + 'defaults property must be set';
            }            

            // check if map property is set
            if (modelSkeleton.chosen.map === undef) {
                throw chosenError + 'map property must be set';
            }

            // check if attr property is set
            if (modelSkeleton.chosen.attr === undef) {
                throw chosenError + 'attr property must be set';
            }            

            // check default model skeleton
            if ((modelSkeleton.chosen.defaults.prototype instanceof Backbone.Model) === false) {
                throw chosenError + 'defaults property must be of type Backbone.Model';
            }

            // check map property
            if (_.isObject(modelSkeleton.chosen.map) === false || _.isArray(modelSkeleton.chosen.map) === true || _.isFunction(modelSkeleton.chosen.map) === true) {
                throw chosenError + 'map must be an object literal';
            } else {
                _.each(modelSkeleton.chosen.map, function modelMapIteratorInstanceCheck (modelRaw, key) {
                    if ((modelRaw.prototype instanceof Backbone.Model) === false) {
                        throw chosenError + 'map property values must be of type Backbone.Model';
                    }
                });
            }

            // check attr property
            if (_.isString(modelSkeleton.chosen.attr) === false) {
                throw chosenError + 'attr property must be a string';
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