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
