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

	function process() {

		var Controller = [];
		var _controller, cLen, mLen, ctrName, modelName, Model;

			// Find controllers directives
			_controller = document.querySelectorAll( '[x-controller]' );
			cLen = _controller.length;

			if( cLen > 0 ) {
				// link controller
				for( var i=0; i < cLen; i+=1 ) {

					var ctrName = _controller[ i ].getAttribute( 'x-controller' );
					var MODELS = loadTextNode( _controller[ i ] );
					var LOOPS =  _controller[ i ].querySelectorAll( '[x-foreach]' );
					Model = [];

					var arrModels = _controller[ i ].querySelectorAll( '[x-model]' );
					var mLen = arrModels.length;

					for( var j=0; j < mLen; j+=1 ) {
						modelName = arrModels[ j ].getAttribute( 'x-model' );
						var elements = getTextNodeByModel( modelName, MODELS  );
						elements.push( arrModels[ j ] );

						Model.push( { name: modelName, DOM: elements, loop: LOOPS.length > 0 ? LOOPS : undefined } )
					}

					Controller.push( { name: ctrName, model: Model } );
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

		var re = /{{\s*([^\s}]+)\s*}}/g, x = 0, res, bck;
		var modelx = [];

		(function a(node) {
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

				for (var i=0; i < node.childNodes.length; i++) {
					a(node.childNodes[i]);
				}
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
				dom[j].el.nodeValue = data[newrows[i].index][dom[j].name];
			}
			$(newrows[i].el.reference).insertBefore(ref);
		}

		// Update the row's value

		for (var i = 0; i < modrows.length; i++) {
			var dom = modrows[i].el.dom;
			for (var j = 0; j < dom.length; j++) {
				dom[j].el.nodeValue = data[modrows[i].index][dom[j].name];
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
