Rinco.Controller( 'myController', function( self ) {
	var count = 0;
	this.setModel( 'githubName', 'allanesquina' );
	this.setModel( 'test', function() { return 'haha'} );

	$.getJSON('assets/js/test.json', function(data){
		console.log(data)
		self.setModel( 'githubName', data.name );

	});
	document.body.addEventListener( 'click', function() { self.setModel( 'test', 'Click-' + ++count )}, false);
	console.log( this );
	console.log( 'myController' );
	setTimeout( function() {
		self.setModel( 'test', '1 after' );
	},1000);
})