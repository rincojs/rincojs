// Model Constructor
function Model( opt ) {
	this.name = opt.name;
	this.type = opt.type || 'model';
	this.DOM = opt.DOM || [];
	this.value;
	this.id = Storage.ID++;
	Event.listen( this.DOM );
	DOM.addAttr( this.DOM, this.id );
}

Model.prototype.setValue = function( value ) {
	
		this.value = value;
		// Action.addToQueue( this.name )
		this.updateDOM();
}

Model.prototype.updateDOM = function() {
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
		
	})
}