var Observer;
// ;(function( window, document ) {
// Directive

var $DOMcontrollers = [];
var $DOMModels = [];
var $Directives = [];

function findDirectives() {

	//Find app directive
	var app = document.querySelectorAll('[fw-app]');
	if( app ) {
		// Find controllers directives
		app.controllers = document.querySelectorAll('[fw-controller]');
		if( app.controllers.length > 0 ) {
			var length = app.controllers.length;
			// link controller
			for( var i=0; i < length; i+=1 ) {
				var name = app.controllers[0].getAttribute('fw-controller');
				// $DOMcontrollers[ name ] = app.controllers[0];
				var arrModels = app.controllers[0].querySelectorAll('[fw-model]');
				var mLength = arrModels.length;




				for( var j=0; j < mLength; j+=1 ) {
					var mName = arrModels[j].getAttribute('fw-model');


					$DOMModels[ name ] = $DOMModels[ name ] || [];
					$DOMModels[ name ][ mName ] = arrModels[j];

					$Directives[ mName ] = new Directive( mName, arrModels[j], null, name );
					$Directives[ mName ].oldValue = $Directives[ mName ].DOM.value;

					Observer.listen( $Directives[ mName ] ); 
				}

				// console.log( $DOMModels, $Directives );
				// $Directives[ mName ].update( 'put your text here' );
			}
		}

	}
}

var Events = (function() {

	function bindEvents( directive ) {
		var obj = directive.DOM
		obj.addEventListener( 'keypress', function( e ) {
			Observer.addToPile( null, e.target.value, directive );
			console.log( e )
		});
		// obj.addEventListener( 'click', function( e ) {
		// 	Observer.addToPile( e, directive );
		// });
	}

	return {
		bind: bindEvents
	}

}());

function compare( directive, oldValue, value ) {

	if( value ) {
		return directive.DOM.value === value;
	}

	return directive.DOM.value === oldValue;
}


Observer = (function() {

	var list = [];
	var pile = [];
	function listen( directive ) {
		list[ directive.controller ] = list[ directive.controller ] || [];
		list[ directive.controller ][ directive.name ] = list[ directive.controller ][ directive.name ] || [];
		list[ directive.controller ][ directive.name ].push( directive );
		Events.bind( directive );
	}
	function addToPile( value, oldValue, directive ) {
		value = value || null;
		oldValue = oldValue || null;

		pile[ directive.controller ] = pile[ directive.controller ] || [];
		pile[ directive.controller ].push( { oldValue:oldValue, value:value, name:directive.name } );

	}
	function fire( controllerName ) {
		pile[ controllerName ] = pile[ controllerName ] || [];

		length = pile[ controllerName ].length;
		for( var i=0; i < length; i++ ) {
			var dir = list[ controllerName ][ pile[ controllerName ][i].name ];
			var dLength = dir.length;
			var oldValue = pile[ controllerName ][i].oldValue;
			var value = pile[ controllerName ][i].value || oldValue;
			for( var j=0; j < dLength; j++ ) {
				// if( !compare( dir[j], oldValue, value ) ) {
					dir[j].update( value );
					console.log( 'fireing', dir[j], oldValue  )
				// }
			}
		}
		pile[ controllerName ] = undefined;
		console.log( pile, list );
	}
	return {
		listen: listen,
		addToPile: addToPile,
		fire: fire
	}

}());

		


function Directive( name, dom, value, controller ) {
	this.DOM = dom
	this.name = name;
	this.value = value;
	this.controller = controller;
	this.oldValue;
}
Directive.prototype.update = function( value ) {
	if( value ) {
		this.DOM.value = value;
	}
	console.log( 'the value was updated' );
}

var fw = {};

fw.md = function( name, dep ) {

	this.name = name;
	this.dep = dep;
	// console.log( this );
}

fw.md.prototype.controller = function( name, fn ) {

	this.sname = name;
	fn.apply( this, [this] );

	Observer.fire( name );

	for( prop in this ) {
		if( $Directives.hasOwnProperty( prop ) ) {
			Observer.addToPile( this[ prop ], $Directives[ prop ].DOM.value, $Directives[ prop ] );
			console.log( prop );
			console.log( this[prop])
		}
	}

	setInterval(function() {
		Observer.fire( name );
	}, 1200);

}

fw.module = function( name, dep ) {
	findDirectives();
	return new fw.md( name, dep );
}

window.fw = fw;

// }( window, document ));


var app = fw.module( 'myApp', [] );
app.controller( 'myController', function( $scope ) {


	$scope.name = 'Joana dark';
	$scope.test = function() {
		$scope.name = 'john Doe';
	}
	setTimeout( function() {
		$scope.test()
		for( prop in $scope ) {
			if( $Directives.hasOwnProperty( prop ) ) {
				console.log( prop );
				console.log( $scope[prop])
				console.log( $Directives[ prop ])
				Observer.addToPile( $scope[ prop ], $Directives[ prop ].DOM.value, $Directives[ prop ] );
			}
		}


	}, 3000);
	// console.log( this );
});
