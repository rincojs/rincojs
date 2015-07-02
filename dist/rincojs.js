;(function( window, document, $) {

	'use strict';

	var Rinco = {};


// Action Module
var Action = (function( window, document ) {

	var queue = [];
	var actionList = [];

	function addToQueue( name ) {
		if( queue.indexOf( name ) === -1 ) {
			queue.push( name );
		}
	}
	function getQueue() {
		return queue;
	}
	function clearQueue( value ) {
		queue = [];
	}

	function register( name, fn, scope ) {
		if( typeof name === 'string' ) {
			actionList[ name ] = actionList[ name ] || [];
			actionList[ name ].push( {scope: scope, fn:fn} );
		}
	}

	function fire( name ) {
		var length = actionList[ name  ].length, i=0;
		// Check if there's event to fire
		if( length > 0 ) {
			// Fire the events
			for( ; i <  length; i+=1 ) {
				actionList[ name ][ i ].fn.call(actionList[ name ][ i ].scope);
				console.log( 2)
			}
		}
	}

	return {
		register: register,
		addToQueue: addToQueue,
		getQueue: getQueue,
		clearQueue: clearQueue,
		fire:fire
	}
}( window, document ));


// Collection constructor
var Collection = Rinco.Collection = function (el) {
  this.id = Storage.collectionID++;
  this.data = [];
  this.rows = [];
  this.reference = el;
  this.process();
  this.state = {modrows:[], newrows:[]};
  console.log(this.rows);
}
Collection.prototype = {
  addRow: function (data){
    var row = new CollectionRow();
  },
  removeRow: function (row) {

  },
  update: function () {
    this.process()
  },
  process: function (val, value) {
      var value = val || [];
      // Create rows by data
      var len = value.length;
      var i=0, row, obj, elements;
      var modified=[], newRows=[], delrows=[];

      if(value.length < this.data.length) {
          delrows = this.rows;
          this.rows=[];
      } 

      for (; i < len; i+=1) {

        if(typeof this.rows[i] === 'undefined') {

            // Create element by element referenc
            obj = $(this.reference.outerHTML);
            obj.removeAttr('x-foreach');

            // Load the TextNode's
            elements = DOM.loadTextNode(obj[0]);

            // Instantiate new row
            row = new CollectionRow(value[i], elements, obj);
            obj.attr('x-cid',this.id);
            obj.attr('x-rid',row.id);
            this.rows[i] = row;
            newRows.push({index:i, value:value[i], el:this.rows[i]});

        } else {
            // Check if has the same value
            // Checks if the values of the array are equals
             if (!_.isEqual(this.data[i], value[i])) {
                modified.push({index:i, value:value[i], el:this.rows[i]});
                // Update the row value
                this.rows[i].data = value[i];
             }
        }

      }
      Object.deepExtend = function(destination, source) {
        for (var property in source) {
          if (source[property] && source[property].constructor &&
           source[property].constructor === Object) {
            destination[property] = destination[property] || {};
            Object.deepExtend(destination[property], source[property]);
          } else {
            destination[property] = source[property];
          }
        }
        return destination;
      };

    this.state = {modrows:modified, newrows:newRows, delrows:delrows};
    Object.deepExtend(this.data, value);
  },
  set: function (value) {
      // this.check(value);
      this.process(value);
  }
}


// Direcitve constructor
var Directive = Rinco.Directive = function(exp, controller, reference) {
  this.id=Storage.directiveID++;
  this.controller = controller || '';
  this.expression=exp || '';
  this.expArgs=[];
  this.reference = reference || {};
  this.process();
}
/*
    console.log(re.exec('a + b'))
    console.log(re.exec('a >= b'))
    console.log(re.exec('a == b'))
    console.log(re.exec('a <= b'))
    console.log(re.exec('a !== b'))
    console.log(re.exec('a * b'))
    console.log(re.exec('a % b'))
    console.log(re.exec('12 + 33'))
    console.log(re.exec('a-b'))
    console.log(re.exec('a==b'))
    console.log(re.exec('a<=b'))
*/
Directive.prototype = {
  process: function () {
  var result = false;

    var expression = this.expression.replace(/\$([a-z_][a-z0-9]*)/gi, 'Storage.cache.controllers["' + this.controller + '"].getModelByName("$1").value');

  try {
  	result = Function.call(null, 'Storage', 'return ' + expression)(Storage);

    } catch (e) {

    }



		// Storage.cache.controllers[this.controller].update();
    if(result) {
        $(this.reference).show();
      } else {
        $(this.reference).hide();
      }

		// Storage.cache.controllers[this.controller].update();
    return;
		var re = /\s*([^\s\!\+\-\>\<\*\%\=]+)\s*([\!\+\-\>\<\*\%\=]+)?\s*([^\s\!\+\-\>\<\*\%\=]+)?\s*/g;
    var res = re.exec(this.expression);
    if (res) {
      // Replace variables for models
      if(res[1].indexOf('$') !== -1) {
        var name = res[1];
        res[1] = 'Storage.cache.controllers[this.controller].getModelByName(name.substr(1)).value';
      }
      if(res[3] && res[3].indexOf('$') !== -1) {
        var name = res[3];
        res[3] = 'Storage.cache.controllers[this.controller].getModelByName(name.substr(1)).value';
      }
      try {
        var result = eval((res[1] || '') + (res[2] || '') + (res[3] || ''));
      } catch (e) {
          result = false;
      }
      console.log(res[1] + res[2] + res[3]);
      console.log(result);
      console.log(res);
      if(result) {
        $(this.reference).show();
      } else {
        $(this.reference).hide();
      }
    }
  }
}

// Test
// var Storage={directiveID:0};


// Line model
var CollectionRow = Rinco.CollectionRow = function (data, dom, ref) {
  this.data = data;
  this.dom = dom;
  this.reference = ref;
  this.id = Storage.rowID++;
}
CollectionRow.prototype  = {
  update: function () {

	},
  set: function (val) {

  }

}


/**
 * Descricao da lib
 * @author Allan Esquina
 */

/**
 * Classe/construtor de controllers
 * @param string name Nome do controller
 * @category Evento
 */
function Controller( name ) {

	this.name = name;
	this.model;
	this.fn;
	this.directive =[];
	this.directives=[];
	console.log(this);

	Action.register('updateDirectives', this.fireDirectives, this);
}

/**
  Alguma coisa
  @var string
  @category Evento
  @example
   // faça tal coisa
   this.valor = "string"
  @example
   // outro coisa
   this.valor = "xxxx"
 */
Controller.prototype.x = 'aquui';

/**
 * Define uma model
 * @param string name Nome da model
 * @param function|string value Alguma coisa
 * @return bool Retrona uma mulher pelada
 */
Controller.prototype.setModel = function( name, value ) {
	var len = this.model.length, found=false;
	for( var i=0; i < len; i+=1 ) {
		if( this.model[ i ].name === name ) {
			found =true;
			if( value && value.call ) {
				this.model[ i ].set( value.call() );
			} else {
				this.model[ i ].set( value );
		 }
		}
	}
	// Create a new model if then did not found
	if(!found) {
		var model = new Model({name:name, value:value});
		this.model.push(model);
	}
	this.fireDirectives();
	console.log( 'Setting model' );
}
Controller.prototype.getModelByName = function( name ) {
	var len = this.model.length;
	for( var i=0; i < len; i+=1 ) {
		if( this.model[ i ].name === name ) {
			return this.model[i];
		}
	}
}

Controller.prototype.fireDirectives = function() {
	for (var i = 0; i < this.directives.length; i++) {
		this.directives[i].process();
	}
}
Controller.prototype.updateModels = function() {
	for (var i = 0; i < this.model.length; i++) {
		this.model[i].update();
	}
}
Controller.prototype.update = function() {
	this.updateModels();
	this.fireDirectives();
}
Controller.prototype.process = function() {
	for (var i = 0; i < this.directive.length; i++) {
		var exp = $(this.directive[i]).attr('x-if');
		this.directives.push(new Directive(exp, this.name, this.directive[i]));
	}
}


/**
 * Bang do milenio
 * @author Allan Esquina
 */

// DOM module
var DOM = (function( window, document ) {

	function getTextNodeByModel( name, model ) {

		var len = model.length, tmp = [];
		for( var i=0; i < len; i+=1 ) {
			if( model[ i ].name === name ) {
				tmp.push( model[i].el );
			}
		}
		return tmp;
	}
	function getModelFromAttr(el) {
		var attr, model=[];
		var re = /in\s*([^\s]+)\s*/;

		for (var i = 0; i < el.length; i++) {

			attr = $(el[i]).attr('x-foreach');
			var res = re.exec(attr);
			if (res) {
				model.push(res[1]);
				el[res[1]] = el[i];
			}
		}

		return model;
		// body...
	}
	function process() {

		var Controller = [];
		var _controller, cLen, mLen, ctrName, modelName, Model;

			// Find controllers directives
			_controller = document.querySelectorAll( '[x-controller]' );
			cLen = _controller.length;
			var sufix = ['click', 'blur', 'focus', 'dblclick'],ONDIRECTIVES;

			if( cLen > 0 ) {
				// link controller
				// Get the events attr
				for( var i=0; i < cLen; i+=1 ) {
					ONDIRECTIVES =[];
					for (var x = 0; x < sufix.length; x++) {
						var tm = _controller[ i ].querySelectorAll( '[x-on' + sufix[x] + ']' )
						if(tm.length > 0) {
							_.extend( ONDIRECTIVES, _controller[ i ].querySelectorAll( '[x-on' + sufix[x] + ']' ), ONDIRECTIVES)
						}
					}

					var ctrName = _controller[ i ].getAttribute( 'x-controller' );
					var MODELS = loadTextNode( _controller[ i ] );
					var LOOPS =  _controller[ i ].querySelectorAll( '[x-foreach]' );
					var DIRECTIVES =  _controller[ i ].querySelectorAll( '[x-if]' );
					var LOOPMODELS = getModelFromAttr(LOOPS);
					Model = [];

					var arrModels = _controller[ i ].querySelectorAll( '[x-model]' );
					var mLen = arrModels.length;

					for( var j=0; j < mLen; j+=1 ) {
						modelName = arrModels[ j ].getAttribute( 'x-model' );
						var elements = getTextNodeByModel( modelName, MODELS  );
						elements.push( arrModels[ j ] );

						Model.push( { name: modelName, DOM: elements, loop:[] } )
					}
					// Collections
					for (var k = 0; k < LOOPMODELS.length; k++) {
						Model.push( { name: LOOPMODELS[k], DOM: [], loop: [LOOPS[LOOPMODELS[k]]] } )
					}

					Controller.push( { name: ctrName, model: Model, directive:DIRECTIVES, on:ONDIRECTIVES } );
				}
			}

		Storage.controller = Controller;
	}


	function addAttr( el, id ) {
		for( var i=0, len= el.length; i < len; i+=1 ) {
			if( el[i].nodeType === 1) {

				el[i].setAttribute( 'x-id', id );
			}
		}
	}

	function loadTextNode( el ) {

		var modelx = [];

		(function a(node) {
			var res, re = /{{\s*([^\s}]+)\s*}}/g, bck;
			if(node.id == 'x') {
				console.log('fdp', node);
			}
			if($(node).attr('x-foreach')) return
			// text node
			if (node.nodeType == 3) {
				res = re.exec(node.nodeValue);
				if (res) {
					bck = node.nodeValue;
					node.nodeValue = node.nodeValue.substr(0, res.index);
					var x = document.createTextNode('');
					//node.parentNode.appendChild(x);
					node.parentNode.insertBefore(x, node.nextSibling);

					modelx.push( {name:res[1], el: x});
					var y = document.createTextNode(bck.substr(res.index + res[0].length));
					//node.parentNode.appendChild(y);
					node.parentNode.insertBefore(y, x.nextSibling)
				}
			}
			else {
				if (node.nodeType == 1) {
					for (var j=0, alen = node.attributes.length; j < alen; j++) {
						if (res = re.exec(node.attributes[j].value)) {
							node.attributes[j].copy = node.attributes[j].value;
							modelx.push({name: res[1], el: node.attributes[j]});
						}
					}
				}
			}


			for (var i=0; i < node.childNodes.length; i++) {
				a(node.childNodes[i]);
			}



		}( el ));
		return modelx;
	}
	function _repeat (el, items) {
		var len = items.length, i=0;
		var string = el.outerHTML;
		var line = '';
		var arr=[];
		// rows
		for( ; i < len; i+=1) {
			line = string;
			// variables
			for( var k in items[i]) {
				line = render( line, k, items[i] )
			}
			arr.push(line);
		}
		$(el).parent().html(arr.join(''))
	}

	function render( tpl, key, data ) {
	  var tmp = new RegExp( '{{\s*' + key + '\s*}}', 'g' );
	  tpl = tpl.replace( tmp, data[ key ] );
  	return tpl;
	}

	function updateValue (els) {
		for (var i = 0; i < els.length; i++) {
			els[i].el.nodeValue=els[i].value;
		}
	}

	function repeat (collection) {

		var rows = collection.rows;
		var ref = collection.reference;
		var data = collection.data;
		var delrows = collection.state.delrows;
		var newrows = collection.state.newrows;
		var modrows = collection.state.modrows;

		// Delete all rows

		for (var i = 0; i < delrows.length; i++) {
			var dom = delrows[i].dom;
			$(delrows[i].reference).remove();
		}

		// Add new rows
		for (var i = 0; i < newrows.length; i++) {
			var dom = newrows[i].el.dom;
			for (var j = 0; j < dom.length; j++) {
				if( dom[j].el.nodeValue !== '') {

					dom[j].el.nodeValue = dom[j].el.nodeValue.replace(/{{\s*([^}]+)\s*}}/g, function(a, b) {
						if(b==="$index") {
								return newrows[i].index;
						}
						return data[newrows[i].index][b];
					})
				} else {
					if(dom[j].name==='$index') {
						dom[j].el.nodeValue = newrows[i].index;
					} else {
						dom[j].el.nodeValue = data[newrows[i].index][dom[j].name];
					}
				}

				//dom[j].el.nodeValue = data[newrows[i].index][dom[j].name];
			}

			$(newrows[i].el.reference).insertBefore(ref);
		}

		// Update the row's value

		for (var i = 0; i < modrows.length; i++) {
			var dom = modrows[i].el.dom;
			for (var j = 0; j < dom.length; j++) {
				// dom[j].el.nodeValue = data[modrows[i].index][dom[j].name];

				dom[j].el.nodeValue = dom[j].el.nodeValue.replace(/{{\s*([^}]+)\s*}}/g, function(a, b) {
					if(b==="$index") {
							return modrows[i].index;
					}
					return data[modrows[i].index][b];
				})
			}
		}

	}

	return {
		process: process,
		addAttr: addAttr,
		repeat:repeat,
		loadTextNode:loadTextNode,
		updateValue:updateValue
	}
}( window, document ));


// Event Module
var Event = (function( window, document ) {

	var types = [ 'click', 'keydown', 'keyup', 'mouseout' ], len=types.length;

	function bind( obj ){
		for( var j=0, length = obj.length; j < length; j+=1 ) {
			for( var i=0; i < len; i+=1 ) {
				obj[j].addEventListener( types[ i ], receive, false );
			}
		}
	}

	function receive( event ) {
		var el = event.target, id = el.getAttribute( 'x-id' );
		Storage.cache.models[ id ].set( el.value );
		// Action.addToQueue( Storage.Model[ id ].name );
		// console.log(  Storage.cache.models[ id ] )
	}

	function process() {
		$('body').on('click', function(event) {
			  var e=event.target, b, c;
			  while(e.parentNode) {
					c = e.getAttribute('x-onclick');
			    if (c) {
			        b = e;
			        do {
			          if (b.getAttribute('x-controller')) {
									var exp = c;
									var controller = b.getAttribute('x-controller');
									callback(exp, controller);
			            console.log(b.getAttribute('x-controller'));
			            break;
			          }
			        } while (b = b.parentNode);
			    }
			    e = e.parentNode;
			  }
		});
	}
	function callback(expression, controller) {
		// reajustando a string
		expression = expression.replace(/\$([a-z_][a-z0-9]*)/gi, 'Storage.cache.controllers["' + controller + '"].getModelByName("$1").value');
		Function.call(null, 'Storage', 'return ' + expression)(Storage);

		Storage.cache.controllers[controller].update();
		return;

		var re = /\s*([^\s\!\+\-\>\<\*\%\=]+)\s*([\!\+\-\>\<\*\%\=]+)?\s*([^\s\!\+\-\>\<\*\%\=]+)?\s*/g;
    var res = re.exec(expression);
    if (res) {
      // Replace variables for models
      if(res[1].indexOf('$') !== -1) {
        var name = res[1];
        res[1] = 'Storage.cache.controllers[controller].getModelByName(name.substr(1)).value';
      }
      if(res[3] && res[3].indexOf('$') !== -1) {
        var name = res[3];
        res[3] = 'Storage.cache.controllers[controller].getModelByName(name.substr(1)).value';
      }
      try {

        var result = eval((res[1] || '') + (res[2] || '') + (res[3] || ''));
				// Update all models and directives of the controller
				Storage.cache.controllers[controller].update();
      } catch (e) {
          result = false;
      }
      console.log(res[1] + res[2] + res[3]);
      console.log(result);
      console.log(res);
    }
		// body...
	}

	return {
		listen: bind,
		process: process
	}

}( window, document ));


/**
 * Model
 * @author Allan Esquina
 */

/**
 * Model constructor
 * @param object opt { name: name, type:type}
 * @category Rinco.Model
 *  @example
 *  // Instantiate model
 *  new Model (name: 'myModel', type: 'model');
 */
var Model = Rinco.Model = function (opt) {
	this.name = opt.name;
	this.type = opt.type || 'model';
	this.value = opt.value || '';
	this.id = Storage.ID++;
	this.DOM = opt.DOM || [];
	this.loop = opt.loop || [];
	this.collections = [];

	Event.listen( this.DOM );
	this.makeCollections();

	DOM.addAttr(this.DOM, this.id);
	console.log(this);
}

_.extend( Model.prototype, {

	/**
	 * This method set the model's value
	 * @param string value Value that will be seted on model
	 * @category Rinco.Model
	 * @return void
 	*/
	 set: function( value ) {

			this.value = value;
			// Action.addToQueue( this.name )
			this.update();
	},

	/**
	 * Update the model's dom objects setting the model's value for each one
	 * @category Rinco.Model
	 * @return void
 	*/
	update: function() {
		this.updateDom();
		// this.updateLoops();
		this.updateCollections();
		Action.fire('updateDirectives');

	},
	updateDom: function() {
		var self = this;
		this.DOM.forEach( function( el ) {
			if (el.nodeType == 2) {
				el.value = el.copy.replace(/{{\s*([^\s}]+)\s*}}/g, function(or, varName) {
					return self.value;
				});
			}
			// attribute
			else {
				el[ el.nodeType===1?'value':'nodeValue']=self.value;
			}

		});
	},
	makeCollections: function () {

		var len = this.loop.length, i=0;
		for(;i < len; i+=1) {
			this.collections.push(new Collection(this.loop[i]));
			this.updateCollections();
		}

	},
	updateCollections: function () {

		var len = this.collections.length, i=0;
		if( !this.value.push ) return;
		for(;i < len; i+=1) {
			this.collections[i].set(this.value);
			DOM.repeat(this.collections[i]);
		}
	}
});


// TODO change Module to a instance and this method to be part of then
var Module = (function( window, document ) {

	function bindController( name, fn ) {

		var ctr = getController( name );
		if( ctr ) {
			fn.apply( ctr, [ctr] );
			console.log( 'bindController');
		}
	}

	function getController( name ) {
		return Storage.cache.controllers[name];
	}

	function init( name, fn ) {
		// Heartbeat.init();
		bindController( name, fn );
	}

	return {
		Controller: init
	}

}( window, document ));


var Storage = {
	controller: {},
	collectionID:0,
	rowID:0,
	ID:0,
	model : [],
	cache: {
		controllers: [],
		models:[]
	}
};


// Bootstrap module
var Bootstrap = Rinco.Bootstrap = (function() {

  function build() {
    var len = Storage.controller.length, i=0, instance, mLen, ctrModel, Models;
    for( ; i < len; i+=1 ) {
      Models = [];
      ctrModel = Storage.controller[ i ].model;
      mLen = ctrModel.length;

      for( var j=0; j < mLen; j+=1 ) {
        var modelInstance = new Model( ctrModel[ j ] );
        Models.push( modelInstance );
        Storage.cache.models[ modelInstance.id ] = modelInstance;
      }

      instance = new Controller( Storage.controller[ i ].name );
      instance.directive = Storage.controller[ i ].directive;
      instance.model = Models;
      instance.on = Storage.controller[ i ].on;
      instance.process();
      Storage.cache.controllers[instance.name] = instance;
    }
    // Initiate the event delegate
    Event.process();
  }

  function init () {
    DOM.process();
    build();
  }
  init();
  return {
    init:init
  }

}(window, document));



	window.Rinco = Module;
	window.rincostorage = Storage;
	window.r = Rinco;

}( window, document, Zepto ));
