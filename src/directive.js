// Direcitve constructor
var Directive = Rinco.Directive = function(exp, controller, reference) {
  this.id=Storage.directiveID++;
  this.controller = controller || '';
  this.expression=exp || '';
  this.expArgs=[];
  this.reference = reference || {};
  this.process();
}

Directive.prototype = {
  process: function () {
  var result = false;

    var expression = this.expression.replace(/\$([a-z_][a-z0-9]*)/gi, 'Storage.cache.controllers["' + this.controller + '"].getModelByName("$1").value');

  try {
  	result = Function.call(null, 'Storage', 'return ' + expression)(Storage);

    } catch (e) {

    }

		// Storage.cache.controllers[this.controller].update();
    if(result) {
        $(this.reference).css('display', 'block');
      } else {
        $(this.reference).css('display', 'none');
      }

		// Storage.cache.controllers[this.controller].update();
  }
}
