// Event Module
var Event = (function( window, document ) {

	var types = [ 'keyup', 'keydown' ], len=types.length;

	function bind( obj ){
		for( var j=0, length = obj.length; j < length; j+=1 ) {
			for( var i=0; i < len; i+=1 ) {
				obj[j].addEventListener( types[ i ], receive, false );
			}
		}
	}

	function receive( event ) {
		var el = event.target,
			id = el.getAttribute( 'x-id' ),
			expression = el.getAttribute('x-keypress') || '',
			controller = Storage.cache.models[ id ].controller;

Storage.cache.models[ id ].set( el.value );

		// reajustando a string
		expression = expression.replace(/\$([a-z_][a-z0-9]*)/gi, 'Storage.cache.controllers["' + controller + '"].getModelByName("$1")');
		console.log(expression);
		Function.call(null, 'Storage', 'return ' + expression)(Storage);
		// Storage.cache.controllers[controller].update();


		// Action.addToQueue( Storage.Model[ id ].name );
		// console.log(  Storage.cache.models[ id ] )
	}

	function process() {
		$('body').on('click', function(event) {
			  var e=event.target, b, c;
				console.log(event.type);
			  while(e.parentNode) {
					c = e.getAttribute('x-onclick') ;
			    if (c) {
			        b = e;
			        do {
			          if (b.getAttribute('x-controller')) {
									var exp = c;
									var controller = b.getAttribute('x-controller');
									var id = b.getAttribute( 'x-id' ) || '';
									callback(exp, controller, id);
			            console.log(b.getAttribute('x-controller'));
			            break;
			          }
			        } while (b = b.parentNode);
			    }
			    e = e.parentNode;
			  }
		});
	}
	function callback(expression, controller, id) {

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
