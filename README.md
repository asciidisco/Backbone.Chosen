Backbone.Chosen
===============

One Collection, different models, mapped easy via configuration.

Backbone.Chosen gives your Backbone Collections multiple personalities.
It is related to the following Backbone Issue (it´s more a feature request)
[#1148](https://github.com/documentcloud/backbone/pull/1148)

It gives you the ability to have a collection with instances of different models prototypes.
Lets outline this with a small example that backbone can´t handle on its own:

You fetch a set of json data, lets say some filesystem contents:
```javascript
[ 
  {
    "id": 1,
    "name": "afile.txt",
    "size": 24234,
    "type": "file"
   },   
  {
    "id": 2,
    "name": "adir",
    "type": "dir" 
  }
]
```

Then you create a collection containing all of this entries, but you want
to create different models for files and directories.

With the standard behaviour of Backbone, this is not possible.
Backbone.Chosen to the rescue.

## Build Status, Project Page, Annotated Source & Tests
[![Build Status](https://secure.travis-ci.org/asciidisco/Backbone.Chosen.png?branch=master)](http://travis-ci.org/asciidisco/Backbone.Chosen)<br /><br />
[Project Page](http://asciidisco.github.com/Backbone.Chosen/index.html)<br />
[Docs](http://docmaps.io/asciidisco/Backbone.Chosen/src/backbone.chosen.js)<br />
[Tests](http://asciidisco.github.com/Backbone.Chosen/test/index.html)<br />
[NPM registry](http://search.npmjs.org/#/Backbone.Chosen)

## Installation

### Source Code And Downloads

You can download the raw source code from the "src" folder above, or grab one of the
builds from the root directory. 

To get the latest stable release, use these links which point to the 'master' branch's
builds:

Development: [backbone.chosen.js](https://raw.github.com/asciidisco/backbone.chosen/master/backbone.chosen.js)
Production: [backbone.chosen.min.js](https://raw.github.com/asciidisco/backbone.chosen/master/backbone.chosen.min.js)

### VOLO
```shell
$ volo add Backbone.Chosen
```

### NPM
```shell
$ npm install Backbone.Chosen
```

## Integration
Note: This plugin is UMD compatible, you can use it in node, amd and vanilla js envs

### Vanilla JS
```html
<script src="underscore.js"></script>
<script src="backbone.js"></script>
<script src="backbone.chosen.js"></script>
```

### Node
```javascript
var _ = require('underscore');
var Backbone = require('backbone');
var Chosen = require('backbone.chosen');
```

### AMD
```javascript
define(['underscore', 'backbone', 'backbone.chosen'], function (_, Backbone, Chosen) {
});
```

## Usage

### Mapping attributes to models

A simple example how to map some data based on an attribute:

```javascript
	// Set up the models
	var SaltyModel = Backbone.Model.extend({
		defaults: {
			taste: 'salty'
		}
	});
	var SweetyModel = Backbone.Model.extend({
		defaults: {
			taste: 'sweet'
		}
	});
	var BoringModel = Backbone.Model.extend({
		defaults: {
			taste: null
		}
	});

	// Set up the collection
	var Collection = Backbone.Collection.extend({
        model: {
            chosen: {
                attr: 'spice',
                defaults: BoringModel,
                map: {
                    salt: SaltyModel,
                    sugar: SweetyModel
                }
            }
        }
	});

	// Set up the data
	var flavours = [{
		id: 1,
		spice: 'salt'
	}, {
		id: 2,
		spice: 'sugar'
	}];

	// Init collection with static data
	var collection = new Collection(flavours);

	collection.get(1) instanceof SaltyModel // true
	collection.get(2) instanceof SweetyModel // true
```

### Set a default model

If none of your mappings matches, you always have to insert a fallback aka. default model:

```javascript
	// Set up test models
	var SaltyModel = Backbone.Model.extend({
		defaults: {
			taste: 'salty'
		}
	});
	var SweetyModel = Backbone.Model.extend({
		defaults: {
			taste: 'sweet'
		}
	});
	var BoringModel = Backbone.Model.extend({
		defaults: {
			taste: null
		}
	});

	// Set up test collection
	var Collection = Backbone.Collection.extend({
        model: {
            chosen: {
                attr: 'spice',
                defaults: BoringModel,
                map: {
                    salt: SaltyModel,
                    sugar: SweetyModel
                }
            }
        }
	});

	// Set up the mock data
	var flavours = [{
		id: 1,
		spice: 'salt'
	}, {
		id: 2,
		spice: 'sugar'
	}, {
		id: 3,
		spice: 'sour'
	}];

	// Init collection with mock data
	var collection = new Collection(flavours);

	collection.get(3) instanceof BoringModel // true
```

### Mapping deeper nested attributes

If the attribute your trying to map, is deeper nested in your
incoming JSON, the deeper nested attributes mapping makes smth. like this possible:

```javascript
	// Set up some models
	var SaltyModel = Backbone.Model.extend({
		defaults: {
			taste: 'salty'
		}
	});
	var SweetyModel = Backbone.Model.extend({
		defaults: {
			taste: 'sweet'
		}
	});
	var BoringModel = Backbone.Model.extend({
		defaults: {
			taste: null
		}
	});

	// Set up a collection
	var Collection = Backbone.Collection.extend({
        model: {
            chosen: {
            	// NOTICE this deeper nested attr.
                attr: 'spices.type.names.displayName',
                defaults: BoringModel,
                map: {
                    salt: SaltyModel,
                    sugar: SweetyModel
                }
            }
        }
	});

	// Set up the static data
	var flavours = [{
		id: 1,
		spices: {
			type: {
				names: {
					displayName: 'salt'
				}
			},
			origin: 'belgium'
		}
	}, {
		id: 2,
		spices: {
			type: {
				names: {
					displayName: 'sugar'
				}
			},
			origin: 'netherlands'
		}
	}, {
		id: 3,
		spices: {
			type: {
				names: {
					displayName: 'sour'
				}
			},
			origin: 'germany'
		}
	}];

	var collection = new Collection(flavours);

	// check instances
	collection.get(1) instanceof SaltyModel // true
	collection.get(2) instanceof SweetyModel // true
	collection.get(3) instanceof BoringModel // true

```

### Use a function to map models

If the standard mapping isnt enough for you,
you can specify your own mapping function

```javascript
	// Set up some models
	var SaltyModel = Backbone.Model.extend({
		defaults: {
			taste: 'salty'
		}
	});
	var SweetyModel = Backbone.Model.extend({
		defaults: {
			taste: 'sweet'
		}
	});
	var BoringModel = Backbone.Model.extend({
		defaults: {
			taste: null
		}
	});

	// Set up a collection
	var Collection = Backbone.Collection.extend({
        model: {
            chosen: function (rawData) {
            	if (rawData.spice === 'salt') {
            		return SaltyModel;
            	}

            	if (rawData.spice === 'sugar') {
            		return SweetyModel;
            	}

            	return BoringModel;   	
            }
        }
	});

	// Set up the static data
	var flavours = [{
		id: 1,
		spice: 'salt'
	}, {
		id: 2,
		spice: 'sugar'
	}, {
		id: 3,
		spice: 'sour'
	}];

	// Init collection with mock data
	var collection = new Collection(flavours);

	collection.get(1) instanceof SaltyModel // true
	collection.get(2) instanceof SweetyModel // true
	collection.get(3) instanceof BoringModel // true		
```

## Support

### Help With Code And Questions

If you're interested in helping with code and questions, please
see the issues list and stack overflow tag here, you can also reach me on twitter:

* [Github Issues](//github.com/asciidisco/backbone.chosen/issues)
* [StackOverflow Tag](http://stackoverflow.com/questions/tagged/backbone.chosen)
* [Twitter](http://twitter.com/asciidisco)

If you have an idea to improve Backbone.Chosen or want to report
a bug, please use the issues list.

## Compatibility And Requirements

Theses libraries are required for the use, development, testing and
documentation of Backbone.Chosen.

### Runtime Requirements

Backbone.Chosen currently works with the following versions of these 
libraries:

* Backbone v0.9.2
* Underscore v1.3.3

Backbone.Chosen has not been tested against any other versions of these
libraries. You may or may not have success if you use a version other
than what it listed here.

## Build Tools Used

I use a number of tools to build, test and maintain Backbone.Chosen, including
but not limited to:

### Grunt

The [Grunt](https://github.com/cowboy/grunt) project is used
to generate the builds for Backbone.Chosen.

### QUnit && PhantomJS

Backbone.Chosen is also tested with the [QUnit](http://docs.jquery.com/QUnit) JavaScript test utility,
using the [PhantomJS](http://phantomjs.org/) runner. 

### Travis CI

Backbone.Chosen uses [Travis CI](http://travis-ci.org/) as a post commit hook,
to ensure that it´s tests are passing and assures that the coding guidelines are
passed using JSHint

### Annotated Source Code

I'm using [Docco](http://jashkenas.github.com/docco/) to generate the annotated source code together
with the great [DocMaps](http://docmaps.io) service.

## Release Notes (Changlog)

### v0.1.1
+ Added: A bunch of tests covering the basic functionality
+ Added: Examples and documentation in the readme
+ Added: A few more inline type tests to check the types of the chosen properties 

### v0.1.0
+ Initial realease

## Legal Foobarbaz (MIT License)

Copyright (c) 2012 Sebastian Golasch, asciidisco

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
