Rinco.Controller( 'myController', function( self ) {
	var count = 0;
	this.setModel( 'githubName', 'allanesquina' );
	this.setModel( 'test', function() { return 'haha'} );
	document.body.addEventListener( 'click', function() { self.setModel( 'test', 'Click-' + ++count )}, false);
	console.log( this );
	console.log( 'myController' );
	setTimeout( function() {
		self.setModel( 'githubName', '1 after' );
	},1000);
})
