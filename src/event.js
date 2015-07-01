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

	return {
		listen: bind
	}

}( window, document ));
// document.body.onclick = function(event) {
//   var e=event.target, b;
//   while(e.parentNode) {
//     if (e.getAttribute('x-onclick')) {
//         b = e;
//         do {
//           if (b.getAttribute('x-controller')) {
//             console.log(b.getAttribute('x-controller'));
//             break;
//           }
//         } while (b = b.parentNode);
//     }
//     e = e.parentNode;
//   }
// }
