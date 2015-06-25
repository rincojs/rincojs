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

		//Find app directive
		var app = document.querySelectorAll( '[x-app]' );
		if( app ) {

			// Find controllers directives
			_controller = document.querySelectorAll( '[x-controller]' );
			cLen = _controller.length;

			if( cLen > 0 ) {
				// link controller
				for( var i=0; i < cLen; i+=1 ) {

					var ctrName = _controller[ i ].getAttribute( 'x-controller' );
					var MODELS = loadTextNode( _controller[ i ] );
					console.log( MODELS)
					Model = [];

					var arrModels = _controller[ i ].querySelectorAll( '[x-model]' );
					var mLen = arrModels.length;

					for( var j=0; j < mLen; j+=1 ) {
						modelName = arrModels[ j ].getAttribute( 'x-model' );
						var elements = getTextNodeByModel( modelName, MODELS  );
						console.log( elements )
						elements.push( arrModels[ j ] );

						Model.push( { name: modelName, DOM: elements } ) 
					}

					Controller.push( { name: ctrName, model: Model } );
				}
			}

		Storage.Controller = Controller;
		}
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

	return {
		process: process,
		addAttr: addAttr
	}
}( window, document ));