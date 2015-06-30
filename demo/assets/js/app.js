// Rinco.Controller( 'myController2', function( self ) {
// 	var count ;
// 	// this.setModel( 'githubName', 'allanesquina' );
// 	this.setModel( 'githubName', [{value:'fender', teste:'tested value', opa:'aeee fuck'}, {value:'ibanez'},{value:'gibson'}, {value:'yamaha'}] );
// 	this.setModel( 'test', function() { return 'haha'} );
//
// })
//
var val = [{value:'aperson', teste:'avalue', opa:'aaeee'}, {value:'ibanez'},{value:'gibson'}, {value:'ayamaha'}];
var icount = 0;
Rinco.Controller( 'myController4', function( self ) {

	self.setModel('showtitle', false );
	setTimeout(function() {
		self.setModel('showtitle', true );
	  // body...
	}, 2000);
});
Rinco.Controller( 'myController3', function( self ) {
	// this.setModel( 'githubName', 'allanesquina' );
	this.setModel( 'githubName', 'allan' );
	self.setModel( 'items', val );
	self.setModel( 'items2', val );
	self.setModel( 'newmodel', val );
	// setInterval(function() {
	// 	if( icount > 10 ) return;
	// 	val.push({value:'interval'+icount, teste:'alopra', opa:'aeee'});
	// 	// console.log(val[0]);
	// 	val[0].teste = 'Allan' + icount;
	// 	self.setModel( 'loop', val );
	// 	icount++;
	// }, 500);
	// setInterval(function() {
	// 	if( icount <= 4 ) {
	//
	// 		val.splice(0,1);
	// 		// console.log(val[0]);
	// 		self.setModel( 'loop', val );
	// 	} else {
	//
	// 		val.push({value:'interval'+icount, teste:'alopra', opa:'aeee'});
	// 		// console.log(val[0]);
	// 		val[0].teste = 'Allan' + icount;
	// 		self.setModel( 'loop', val );
	// 		if( icount === 8 ) {
	// 			icount=0;
	// 		}
	// 	}
	// 	icount++;
	// }, 500);
})
// Rinco.Controller( 'myController2', function( self ) {
// 	var count = 0;
// 	this.setModel( 'githubName', 'allanesquina' );
// 	this.setModel( 'test', function() { return 'haha'} );
// })
