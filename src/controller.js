// Controller Constructor
function Controller( name ) {
	this.name = name;
	this.model;
	this.fn;
}

Controller.prototype.setModel = function( name, value ) {
	var len = this.model.length;
	for( var i=0; i < len; i+=1 ) {
		if( this.model[ i ].name === name ) {
			if( value && value.call ) {
				this.model[ i ].setValue( value.call() );
			} else {
				this.model[ i ].setValue( value );
			}
		}
	}
	console.log( 'Setting model' );
}
