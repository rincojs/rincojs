/**
 * Model 
 * @author Allan Esquina
 */

/**
 * Model constructor
 * @param object opt { name: name, type:type} 
 * @category Rinco.Model
 *  @example
 *  // Instantiate model 
 *  new Model (name: 'myModel', type: 'model');
 */
var Model = Rinco.Model = function (opt) {
	this.name = opt.name;
	this.type = opt.type || 'model';
	this.value;
	this.id = Storage.ID++;
	this.DOM = opt.DOM || [];
	
	Event.listen( this.DOM );
	
	DOM.addAttr( this.DOM, this.id );
}

_.extend( Model.prototype, {

	/**
	 * This method set the model's value
	 * @param string value Value that will be seted on model
	 * @category Rinco.Model
	 * @return void
 	*/
	 set: function( value ) {
		
			this.value = value;
			// Action.addToQueue( this.name )
			this.update();
	},

	/**
	 * Update the model's dom objects setting the model's value for each one 
	 * @category Rinco.Model
	 * @return void
 	*/
	update: function() {

		var self = this;
		this.DOM.forEach( function( el ) {
			if (el.nodeType == 2) {
				el.value = el.copy.replace(/{{\s*([^\s}]+)\s*}}/g, function(or, varName) {
					return self.value;
				});
			}
			// attribute
			else {
				el[ el.nodeType===1?'value':'nodeValue']=self.value;
			}
			
		});
	}
});
