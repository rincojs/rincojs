// Collection constructor
var Collection = Rinco.Collection = function (el) {
  this.id = Storage.collectionID++;
  this.data = [];
  this.rows = [];
  this.reference = el;
  this.process();
  this.state = {modrows:[], newrows:[]};
  console.log(this.rows);
}
Collection.prototype = {
  addRow: function (data){
    var row = new CollectionRow();
  },
  removeRow: function (row) {

  },
  update: function () {
    this.process()
  },
  process: function (val, value) {
      var value = val || [];
      // Create rows by data
      var len = value.length;
      var i=0, row, obj, elements;
      var modified=[], newRows=[], delrows=[];

      if(value.length < this.data.length) {
          delrows = this.rows;
          this.rows=[];
      } 

      for (; i < len; i+=1) {

        if(typeof this.rows[i] === 'undefined') {

            // Create element by element referenc
            obj = $(this.reference.outerHTML);
            obj.removeAttr('x-foreach');

            // Load the TextNode's
            elements = DOM.loadTextNode(obj[0]);

            // Instantiate new row
            row = new CollectionRow(value[i], elements, obj);
            obj.attr('x-cid',this.id);
            obj.attr('x-rid',row.id);
            this.rows[i] = row;
            newRows.push({index:i, value:value[i], el:this.rows[i]});

        } else {
            // Check if has the same value
            // Checks if the values of the array are equals
             if (!_.isEqual(this.data[i], value[i])) {
                modified.push({index:i, value:value[i], el:this.rows[i]});
                // Update the row value
                this.rows[i].data = value[i];
             }
        }

      }
      Object.deepExtend = function(destination, source) {
        for (var property in source) {
          if (source[property] && source[property].constructor &&
           source[property].constructor === Object) {
            destination[property] = destination[property] || {};
            Object.deepExtend(destination[property], source[property]);
          } else {
            destination[property] = source[property];
          }
        }
        return destination;
      };

    this.state = {modrows:modified, newrows:newRows, delrows:delrows};
    Object.deepExtend(this.data, value);
  },
  set: function (value) {
      // this.check(value);
      this.process(value);
  }
}
