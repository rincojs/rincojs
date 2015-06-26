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
		var len = Storage.cache.controllers.length;
		for( var i=0; i < len; i+=1 ) {
			if( Storage.cache.controllers[i].name === name ) {
				return Storage.cache.controllers[i];
			}
		}
		return false;
	}

	function init( name, fn ) {
		// Heartbeat.init();
		bindController( name, fn );
	}

	return {
		Controller: init
	}

}( window, document ));
