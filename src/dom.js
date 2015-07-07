/**
 * Bang do milenio
 * @author Allan Esquina
 */

// DOM module
var DOM = (function( window, document ) {

	function getTextNodeByModel( name, model ) {

		var len = model.length, tmp = [];
		for( var i=0; i < len; i+=1 ) {
			if( model[ i ].name === name ) {
				tmp.push( model[i].el );
			}
		}
		return tmp;
	}
	function getModelFromAttr(el) {
		var attr, model=[];
		var re = /in\s*([^\s]+)\s*/;

		for (var i = 0; i < el.length; i++) {

			attr = $(el[i]).attr('x-foreach');
			var res = re.exec(attr);
			if (res) {
				model.push(res[1]);
				el[res[1]] = el[i];
			}
		}

		return model;
		// body...
	}
	function process() {

		var Controller = [];
		var _controller, cLen, mLen, ctrName, modelName, Model;

			// Find controllers directives
			_controller = document.querySelectorAll( '[x-controller]' );
			cLen = _controller.length;
			var sufix = ['click', 'blur', 'focus', 'dblclick'],ONDIRECTIVES;

			if( cLen > 0 ) {
				// link controller
				// Get the events attr
				for( var i=0; i < cLen; i+=1 ) {
					ONDIRECTIVES =[];
					for (var x = 0; x < sufix.length; x++) {
						var tm = _controller[ i ].querySelectorAll( '[x-on' + sufix[x] + ']' )
						if(tm.length > 0) {
							_.extend( ONDIRECTIVES, _controller[ i ].querySelectorAll( '[x-on' + sufix[x] + ']' ), ONDIRECTIVES)
						}
					}

					var ctrName = _controller[ i ].getAttribute( 'x-controller' );
					var MODELS = loadTextNode( _controller[ i ] );
					var LOOPS =  _controller[ i ].querySelectorAll( '[x-foreach]' );
					var DIRECTIVES =  _controller[ i ].querySelectorAll( '[x-if]' );
					var LOOPMODELS = getModelFromAttr(LOOPS);
					Model = [];

					var arrModels = _controller[ i ].querySelectorAll( '[x-model]' );
					var mLen = arrModels.length;

					for( var j=0; j < mLen; j+=1 ) {
						modelName = arrModels[ j ].getAttribute( 'x-model' );
						var elements = getTextNodeByModel( modelName, MODELS  );
						elements.push( arrModels[ j ] );

						Model.push( { name: modelName, DOM: elements, loop:[], controller:ctrName } )
					}
					// Collections
					for (var k = 0; k < LOOPMODELS.length; k++) {
						Model.push( { name: LOOPMODELS[k], DOM: [], loop: [LOOPS[LOOPMODELS[k]]] } )
					}

					Controller.push( { name: ctrName, model: Model, directive:DIRECTIVES, on:ONDIRECTIVES } );
				}
			}

		Storage.controller = Controller;
	}


	function addAttr( el, id ) {
		for( var i=0, len= el.length; i < len; i+=1 ) {
			if( el[i].nodeType === 1) {

				el[i].setAttribute( 'x-id', id );
			}
		}
	}

	function loadTextNode( el ) {

		var modelx = [];

		(function a(node) {
			var res, re = /{{\s*([^\s}]+)\s*}}/g, bck;
			if(node.id == 'x') {
				// console.log(node);
			}
			if($(node).attr('x-foreach')) return
			// text node
			if (node.nodeType == 3) {
				res = re.exec(node.nodeValue);
				if (res) {
					bck = node.nodeValue;
					node.nodeValue = node.nodeValue.substr(0, res.index);
					var x = document.createTextNode('');
					//node.parentNode.appendChild(x);
					node.parentNode.insertBefore(x, node.nextSibling);

					modelx.push( {name:res[1], el: x});
					var y = document.createTextNode(bck.substr(res.index + res[0].length));
					//node.parentNode.appendChild(y);
					node.parentNode.insertBefore(y, x.nextSibling)
				}
			}
			else {
				if (node.nodeType == 1) {
					for (var j=0, alen = node.attributes.length; j < alen; j++) {
						if (res = re.exec(node.attributes[j].value)) {
							node.attributes[j].copy = node.attributes[j].value;
							modelx.push({name: res[1], el: node.attributes[j]});
						}
					}
				}
			}


			for (var i=0; i < node.childNodes.length; i++) {
				a(node.childNodes[i]);
			}



		}( el ));
		return modelx;
	}
	function _repeat (el, items) {
		var len = items.length, i=0;
		var string = el.outerHTML;
		var line = '';
		var arr=[];
		// rows
		for( ; i < len; i+=1) {
			line = string;
			// variables
			for( var k in items[i]) {
				line = render( line, k, items[i] )
			}
			arr.push(line);
		}
		$(el).parent().html(arr.join(''))
	}

	function render( tpl, key, data ) {
	  var tmp = new RegExp( '{{\s*' + key + '\s*}}', 'g' );
	  tpl = tpl.replace( tmp, data[ key ] );
  	return tpl;
	}

	function updateValue (els) {
		for (var i = 0; i < els.length; i++) {
			els[i].el.nodeValue=els[i].value;
		}
	}

	function repeat (collection) {

		var rows = collection.rows;
		var ref = collection.reference;
		var data = collection.data;
		var delrows = collection.state.delrows;
		var newrows = collection.state.newrows;
		var modrows = collection.state.modrows;

		// Delete all rows

		for (var i = 0; i < delrows.length; i++) {
			var dom = delrows[i].dom;
			$(delrows[i].reference).remove();
		}

		// Add new rows
		for (var i = 0; i < newrows.length; i++) {
			var dom = newrows[i].el.dom;
			for (var j = 0; j < dom.length; j++) {
				if( dom[j].el.nodeValue !== '') {

					dom[j].el.nodeValue = dom[j].el.nodeValue.replace(/{{\s*([^}]+)\s*}}/g, function(a, b) {
						if(b==="$index") {
								return newrows[i].index;
						}
						return data[newrows[i].index][b];
					})
				} else {
					if(dom[j].name==='$index') {
						dom[j].el.nodeValue = newrows[i].index;
					} else {
						dom[j].el.nodeValue = data[newrows[i].index][dom[j].name];
					}
				}

				//dom[j].el.nodeValue = data[newrows[i].index][dom[j].name];
				ref.parentNode.insertBefore( newrows[i].el.reference[0], ref);
			}

			// $(newrows[i].el.reference).insertBefore(ref);
		}

		// Update the row's value

		for (var i = 0; i < modrows.length; i++) {
			var dom = modrows[i].el.dom;
			for (var j = 0; j < dom.length; j++) {
				// dom[j].el.nodeValue = data[modrows[i].index][dom[j].name];

				dom[j].el.nodeValue = dom[j].el.nodeValue.replace(/{{\s*([^}]+)\s*}}/g, function(a, b) {
					if(b==="$index") {
							return modrows[i].index;
					}
					return data[modrows[i].index][b];
				})
			}
		}

	}

	return {
		process: process,
		addAttr: addAttr,
		repeat:repeat,
		loadTextNode:loadTextNode,
		updateValue:updateValue
	}
}( window, document ));
