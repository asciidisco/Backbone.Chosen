module('Backbone.Chosen');

test('Can choose between 2 models (incl. default) based on a third party choser function', function () {
	expect(6);
	
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

	// check instances
	ok(collection.get(1) instanceof SaltyModel, 'First collection entry is instance of salty model');
	ok(collection.get(2) instanceof SweetyModel, 'Snd collection entry is instance of sweety model');
	ok(collection.get(3) instanceof BoringModel, 'Thrd collection entry is instance of boring model');

	// check property access
	equal(collection.get(1).get('taste'), 'salty', 'Can acces default property of salty model');
	equal(collection.get(2).get('taste'), 'sweet', 'Can access default property of sweety model');
	equal(collection.get(3).get('taste'), null, 'Can access default property of boring model');

});

test('Can choose between 2 models based on a property', function () {
	expect(4);
	
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
	}]

	// Init collection with mock data
	var collection = new Collection(flavours);

	// check instances
	ok(collection.get(1) instanceof SaltyModel, 'First collection entry is instance of salty model');
	ok(collection.get(2) instanceof SweetyModel, 'Snd collection entry is instance of sweety model');

	// check property access
	equal(collection.get(1).get('taste'), 'salty', 'Can acces default property of salty model');
	equal(collection.get(2).get('taste'), 'sweet', 'Can access default property of sweety model');
});

test('Can choose between models based on a deeper nested property', function () {
	expect(4);
	
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
                attr: 'spices.type',
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
		spices: {
			type: 'salt',
			origin: 'belgium'
		}
	}, {
		id: 2,
		spices: {
			type: 'sugar',
			origin: 'netherlands'
		}
	}]

	// Init collection with mock data
	var collection = new Collection(flavours);

	// check instances
	ok(collection.get(1) instanceof SaltyModel, 'First collection entry is instance of salty model');
	ok(collection.get(2) instanceof SweetyModel, 'Snd collection entry is instance of sweety model');

	// check property access
	equal(collection.get(1).get('taste'), 'salty', 'Can acces default property of salty model');
	equal(collection.get(2).get('taste'), 'sweet', 'Can access default property of sweety model');
	
});

test('Can choose between models based on an extrem deep nested property', function () {
	expect(6);
	
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
                attr: 'spices.type.names.displayName',
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

	// Init collection with mock data
	var collection = new Collection(flavours);

	// check instances
	ok(collection.get(1) instanceof SaltyModel, 'First collection entry is instance of salty model');
	ok(collection.get(2) instanceof SweetyModel, 'Snd collection entry is instance of sweety model');
	ok(collection.get(3) instanceof BoringModel, 'Thrd collection entry is instance of boring model');

	// check property access
	equal(collection.get(1).get('taste'), 'salty', 'Can acces default property of salty model');
	equal(collection.get(2).get('taste'), 'sweet', 'Can access default property of sweety model');
	equal(collection.get(3).get('taste'), null, 'Can access default property of boring model');	
});

test('Uses default when no matching attribute has been found', function () {
	expect(2);
	
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
	}]

	// Init collection with mock data
	var collection = new Collection(flavours);

	// check instances
	ok(collection.get(3) instanceof BoringModel, 'Third collection entry is instance of boring model');

	// check property access
	equal(collection.get(3).get('taste'), null, 'Boring model has no taste at all');
});

test('Throws error when default model is not given', function () {
	expect(1);
	
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

	// Set up test collection
	var Collection = Backbone.Collection.extend({
        model: {
            chosen: {
                attr: 'spice',
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
	}]

	// Init collection with mock data
	raises(function () {
		new Collection(flavours)
	}, function (err) {
		return err === 'Backbone.Chosen Error: defaults property must be set'
	}, 'Raise an error if defaults property is not set');
	
});

test('Throws error when default model is not a Backbone.Model instance', function () {
	expect(1);
	
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
	var NotABackboneModel = function () {};

	// Set up test collection
	var Collection = Backbone.Collection.extend({
        model: {
            chosen: {
                attr: 'spice',
                defaults: NotABackboneModel,
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
	}]

	// Init collection with mock data
	raises(function () {
		new Collection(flavours)
	}, function (err) {
		return err === 'Backbone.Chosen Error: defaults property must be of type Backbone.Model'
	}, 'Raise an error if defaults property is not of type Backbone.Model');
	
});

test('Throws error when map property is missing', function () {
	expect(1);
	var NotABackboneModel = function () {};

	// Set up test collection
	var Collection = Backbone.Collection.extend({
        model: {
            chosen: {
                attr: 'spice',
                defaults: NotABackboneModel
            }
        }
	});

	// Set up the mock data
	var flavours = [{
		id: 1,
		spice: 'salt'
	}];

	// Init collection with mock data
	raises(function () {
		new Collection(flavours);
	}, function (err) {
		return err === 'Backbone.Chosen Error: map property must be set'
	}, 'Raise an error if map property is not set');
	
});

test('Throws error when map property is not an object literal', function () {
	expect(1);
	var ABackboneModel = Backbone.Model.extend({});

	// Set up test collection
	var Collection = Backbone.Collection.extend({
        model: {
            chosen: {
                attr: 'spice',
                defaults: ABackboneModel,
                map: []
            }
        }
	});

	// Set up the mock data
	var flavours = [{
		id: 1,
		spice: 'salt'
	}];

	// Init collection with mock data
	raises(function () {
		new Collection(flavours);
	}, function (err) {
		return err === 'Backbone.Chosen Error: map must be an object literal'
	}, 'Raise an error if map property is not of type object');
});

test('Throws error when map property values are not of type Backbone.Model', function () {
	expect(1);
	var ABackboneModel = Backbone.Model.extend({});

	// Set up test collection
	var Collection = Backbone.Collection.extend({
        model: {
            chosen: {
                attr: 'spice',
                defaults: ABackboneModel,
                map: {
                	salt: function () {}
                }
            }
        }
	});

	// Set up the mock data
	var flavours = [{
		id: 1,
		spice: 'salt'
	}];

	// Init collection with mock data
	raises(function () {
		new Collection(flavours);
	}, function (err) {
		return err === 'Backbone.Chosen Error: map property values must be of type Backbone.Model'
	}, 'Raise an error if map properties are not of type Backbone.Model');
});

test('Throws error when attr property is not set', function () {
	expect(1);
	var ABackboneModel = Backbone.Model.extend({}),
		AnotherBackboneModel = Backbone.Model.extend({});

	// Set up test collection
	var Collection = Backbone.Collection.extend({
        model: {
            chosen: {
                defaults: ABackboneModel,
                map: {
                	salt: AnotherBackboneModel
                }
            }
        }
	});

	// Set up the mock data
	var flavours = [{
		id: 1,
		spice: 'salt'
	}];

	// Init collection with mock data
	raises(function () {
		new Collection(flavours);
	}, function (err) {
		return err === 'Backbone.Chosen Error: attr property must be set'
	}, 'Raise an error if attr property is not set');
});

test('Throws error when attr property is not of type string', function () {
	expect(1);
	var ABackboneModel = Backbone.Model.extend({}),
		AnotherBackboneModel = Backbone.Model.extend({});

	// Set up test collection
	var Collection = Backbone.Collection.extend({
        model: {
            chosen: {
            	attr: ['foobar'],
                defaults: ABackboneModel,
                map: {
                	salt: AnotherBackboneModel
                }
            }
        }
	});

	// Set up the mock data
	var flavours = [{
		id: 1,
		spice: 'salt'
	}];

	// Init collection with mock data
	raises(function () {
		new Collection(flavours);
	}, function (err) {
		return err === 'Backbone.Chosen Error: attr property must be a string'
	}, 'Raise an error if attr property is not of type string');
});