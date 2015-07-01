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
      instance.directive = Storage.controller[ i ].directive;
      instance.model = Models;
      instance.on = Storage.controller[ i ].on;
      instance.process();
      Storage.cache.controllers[instance.name] = instance;
    }
    // Initiate the event delegate
    Event.process();
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
