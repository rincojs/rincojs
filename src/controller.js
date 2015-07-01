/**
 * Descricao da lib
 * @author Allan Esquina
 */

/**
 * Classe/construtor de controllers
 * @param string name Nome do controller
 * @category Evento
 */
function Controller( name ) {

	this.name = name;
	this.model;
	this.fn;
	this.directive =[];
	this.directives=[];
	console.log(this);
}

/**
  Alguma coisa
  @var string
  @category Evento
  @example
   // faça tal coisa
   this.valor = "string"
  @example
   // outro coisa
   this.valor = "xxxx"
 */
Controller.prototype.x = 'aquui';

/**
 * Define uma model
 * @param string name Nome da model
 * @param function|string value Alguma coisa
 * @return bool Retrona uma mulher pelada
 */
Controller.prototype.setModel = function( name, value ) {
	var len = this.model.length, found=false;
	for( var i=0; i < len; i+=1 ) {
		if( this.model[ i ].name === name ) {
			found =true;
			if( value && value.call ) {
				this.model[ i ].set( value.call() );
			} else {
				this.model[ i ].set( value );
		 }
		}
	}
	// Create a new model if then did not found
	if(!found) {
		var model = new Model({name:name, value:value});
		this.model.push(model);
	}
	this.fireDirectives();
	console.log( 'Setting model' );
}
Controller.prototype.getModelByName = function( name ) {
	var len = this.model.length;
	for( var i=0; i < len; i+=1 ) {
		if( this.model[ i ].name === name ) {
			return this.model[i];
		}
	}
}

Controller.prototype.fireDirectives = function() {
	for (var i = 0; i < this.directives.length; i++) {
		this.directives[i].process();
	}
}
Controller.prototype.process = function() {
	for (var i = 0; i < this.directive.length; i++) {
		var exp = $(this.directive[i]).attr('x-if');
		this.directives.push(new Directive(exp, this.name, this.directive[i]));
	}
}
