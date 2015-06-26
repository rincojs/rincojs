Rinco.Controller( 'myController2', function( self ) {
	var count = 0;
	// this.setModel( 'githubName', 'allanesquina' );
	this.setModel( 'githubName', [{value:'fender'}, {value:'ibanez'},{value:'fender'}, {value:'ibanez'}] );
	this.setModel( 'test', function() { return 'haha'} );

})
//
// Rinco.Controller( 'myController2', function( self ) {
// 	var count = 0;
// 	this.setModel( 'githubName', 'allanesquina' );
// 	this.setModel( 'test', function() { return 'haha'} );
// })
