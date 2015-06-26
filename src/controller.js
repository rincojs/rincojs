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
