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
		// Heartbeat.init();
		DOM.process();
		controller = Storage.Controller;
		build();
		bindController( name, fn );
	}

	return {
		Controller: init
	}

}( window, document ));