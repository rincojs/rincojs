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
		Storage.Model[ id ].set( el.value );
		// Action.addToQueue( Storage.Model[ id ].name );
		console.log(  Storage.Model[ id ] )
	}

	return {
		listen: bind
	}

}( window, document ));
