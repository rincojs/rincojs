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

	function process() {
		$('body').on('click', function(event) {
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

		var re = /\s*([^\s\!\+\-\>\<\*\%\=]+)\s*([\!\+\-\>\<\*\%\=]+)?\s*([^\s\!\+\-\>\<\*\%\=]+)?\s*/g;
    var res = re.exec(expression);
    if (res) {
      // Replace variables for models
      if(res[1].indexOf('$') !== -1) {
        var name = res[1];
        res[1] = 'Storage.cache.controllers[controller].getModelByName(name.substr(1)).value';
      }
      if(res[3] && res[3].indexOf('$') !== -1) {
        var name = res[3];
        res[3] = 'Storage.cache.controllers[controller].getModelByName(name.substr(1)).value';
      }
      try {

        var result = eval((res[1] || '') + (res[2] || '') + (res[3] || ''));
				// Update all models and directives of the controller
				Storage.cache.controllers[controller].update();
      } catch (e) {
          result = false;
      }
      console.log(res[1] + res[2] + res[3]);
      console.log(result);
      console.log(res);
    }
		// body...
	}

	return {
		listen: bind,
		process: process
	}

}( window, document ));
