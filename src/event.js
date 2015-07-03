// Event Module
var Event = (function( window, document ) {

	var types = [  ], len=types.length;

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
		$('body').on('click keydown keyup', function(event) {
			console.log(event);

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
	}

	return {
		listen: bind,
		process: process
	}

}( window, document ));
