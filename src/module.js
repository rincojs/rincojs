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
