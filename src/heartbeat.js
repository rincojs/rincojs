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
