// Bootstrap module
var Bootstrap = Rinco.Bootstrap = (function() {

  function build() {
    var len = Storage.controller.length, i=0, instance, mLen, ctrModel, Models;
    for( ; i < len; i+=1 ) {
      Models = [];
      ctrModel = Storage.controller[ i ].model;
      mLen = ctrModel.length;

      for( var j=0; j < mLen; j+=1 ) {
        var modelInstance = new Model( ctrModel[ j ] );
        Models.push( modelInstance );
        Storage.cache.models[ modelInstance.id ] = modelInstance;
      }

      instance = new Controller( Storage.controller[ i ].name );
      instance.model = Models;
      Storage.cache.controllers.push( instance );
    }
  }

  function init () {
    DOM.process();
    build();
  }
  init();
  return {
    init:init
  }

}(window, document));
