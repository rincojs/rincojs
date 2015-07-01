// Direcitve constructor
var Directive = Rinco.Directive = function(exp, controller, reference) {
  this.id=Storage.directiveID++;
  this.controller = controller || '';
  this.expression=exp || '';
  this.expArgs=[];
  this.reference = reference || {};
  this.process();
}
/*
    console.log(re.exec('a + b'))
    console.log(re.exec('a >= b'))
    console.log(re.exec('a == b'))
    console.log(re.exec('a <= b'))
    console.log(re.exec('a !== b'))
    console.log(re.exec('a * b'))
    console.log(re.exec('a % b'))
    console.log(re.exec('12 + 33'))
    console.log(re.exec('a-b'))
    console.log(re.exec('a==b'))
    console.log(re.exec('a<=b'))
*/
Directive.prototype = {
  process: function () {
		var re = /\s*([^\s\!\+\-\>\<\*\%\=]+)\s*([\!\+\-\>\<\*\%\=]+)?\s*([^\s\!\+\-\>\<\*\%\=]+)?\s*/g;
    var res = re.exec(this.expression);
    if (res) {
      // Replace variables for models
      if(res[1].indexOf('$') !== -1) {
        var name = res[1];
        res[1] = 'Storage.cache.controllers[this.controller].getModelByName(name.substr(1)).value';
      }
      if(res[3] && res[3].indexOf('$') !== -1) {
        var name = res[3];
        res[3] = 'Storage.cache.controllers[this.controller].getModelByName(name.substr(1)).value';
      }
      try {
        var result = eval((res[1] || '') + (res[2] || '') + (res[3] || ''));
      } catch (e) {
          result = false;
      }
      console.log(res[1] + res[2] + res[3]);
      console.log(result);
      console.log(res);
      if(result) {
        $(this.reference).show();
      } else {
        $(this.reference).hide();
      }
    }
  }
}

// Test
// var Storage={directiveID:0};
