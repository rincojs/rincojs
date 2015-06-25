;(function( window, document) {

	'use strict';


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

	function register( name, fn ) {
		if( typeof name === 'string' ) {
			actionList[ name ] = actionList[ name ] || [];
			actionList[ name ].push( fn );
		}
	}

	function fire( name ) {
		var length = actionList[ name  ].length, i=0;
		// Check if there's event to fire
		if( length > 0 ) {
			// Fire the events
			for( ; i <  length; i+=1 ) {
				actionList[ name ][ i ].call();
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

// Controller Constructor
function Controller( name ) {
	this.name = name;
	this.model;
	this.fn;
}

Controller.prototype.setModel = function( name, value ) {
	var len = this.model.length;
	for( var i=0; i < len; i+=1 ) {
		if( this.model[ i ].name === name ) {
			if( value && value.call ) {
				this.model[ i ].setValue( value.call() );
			} else {
				this.model[ i ].setValue( value );
			}
		}
	}
	console.log( 'Setting model' );
}


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

	function process() {

		var Controller = [];
		var _controller, cLen, mLen, ctrName, modelName, Model;

		//Find app directive
		var app = document.querySelectorAll( '[x-app]' );
		if( app ) {

			// Find controllers directives
			_controller = document.querySelectorAll( '[x-controller]' );
			cLen = _controller.length;

			if( cLen > 0 ) {
				// link controller
				for( var i=0; i < cLen; i+=1 ) {

					var ctrName = _controller[ i ].getAttribute( 'x-controller' );
					var MODELS = loadTextNode( _controller[ i ] );
					console.log( MODELS)
					Model = [];

					var arrModels = _controller[ i ].querySelectorAll( '[x-model]' );
					var mLen = arrModels.length;

					for( var j=0; j < mLen; j+=1 ) {
						modelName = arrModels[ j ].getAttribute( 'x-model' );
						var elements = getTextNodeByModel( modelName, MODELS  );
						console.log( elements )
						elements.push( arrModels[ j ] );

						Model.push( { name: modelName, DOM: elements } ) 
					}

					Controller.push( { name: ctrName, model: Model } );
				}
			}

		Storage.Controller = Controller;
		}
	}


	function addAttr( el, id ) {
		for( var i=0, len= el.length; i < len; i+=1 ) {
			if( el[i].nodeType === 1) {

				el[i].setAttribute( 'x-id', id );
			}
		}
	}

	function loadTextNode( el ) {

		var re = /{{\s*([^\s}]+)\s*}}/g, x = 0, res, bck;
		var modelx = [];

		(function a(node) {
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

				for (var i=0; i < node.childNodes.length; i++) {
					a(node.childNodes[i]);
				}
			}
		}( el ));
		return modelx;
	}

	return {
		process: process,
		addAttr: addAttr
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
		Storage.Model[ id ].setValue( el.value );
		// Action.addToQueue( Storage.Model[ id ].name );
		console.log(  Storage.Model[ id ] )
	}

	return {
		listen: bind
	}

}( window, document ));


// Heartbeat Module
// Fire events that are in eventPile
var Heartbeat = (function( window, document ) {

	function check() {
		var queue = Action.getQueue();
		var length = queue.length, i=0;
		// Check if there's events on the list
		if( length > 0 ) {
			// Fire the events
			for( ; i <  length; i+=1 ) {
				Action.fire( queue[ i ] );
			}
			Action.clearQueue();
		}
	}

	function init() {
		setInterval( check, 0 );
	}

	return {
		init:init
	}

}( window, document ));


// Model Constructor
function Model( opt ) {
	this.name = opt.name;
	this.type = opt.type || 'model';
	this.DOM = opt.DOM || [];
	this.value;
	this.id = Storage.ID++;
	Event.listen( this.DOM );
	var self = this;
	Action.register( this.name, function() {
		self.updateDOM();
	})
	DOM.addAttr( this.DOM, this.id );
}

Model.prototype.setValue = function( value ) {
	
		this.value = value;
		// Action.addToQueue( this.name )
		this.updateDOM();
}

Model.prototype.updateDOM = function() {
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
		
	})
}

// TODO change Module to a instance and this method to be part of then
var Module = (function( window, document ) {
	var _Controller = [],
		controller;

	function build() {
		var len = controller.length, i=0, instance, mLen, ctrModel, Models;
		for( ; i < len; i+=1 ) {
			Models = [];
			ctrModel = controller[ i ].model;
			mLen = ctrModel.length;

			for( var j=0; j < mLen; j+=1 ) {
				var modelInstance = new Model( ctrModel[ j ] );
				Models.push( modelInstance );
				Storage.Model[ modelInstance.id ] = modelInstance;
			}

			instance = new Controller( controller[ i ].name );
			instance.model = Models;
			_Controller.push( instance );
		}
	}

	function bindController( name, fn ) {

		var ctr = getController( name );
		if( ctr ) {
			fn.apply( ctr, [ctr] );
		}
		console.log( 'bindController');

	}

	function getController( name ) {
		var len = _Controller.length;
		for( var i=0; i < len; i+=1 ) {
			if( _Controller[i].name === name ) {
				return _Controller[i];
			}
		}
		return false;
	}

	function init( name, fn ) {
		Heartbeat.init();
		DOM.process();
		controller = Storage.Controller;
		build();
		bindController( name, fn );
	}

	return {
		Controller: init
	}

}( window, document ));

var Storage = { 
	Controller: {}, 
	ID:0, 
	Model 
};


	window.Rinco = Module;

}( window, document ));