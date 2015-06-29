// Collection constructor
var Collection = Rinco.Collection = function (el) {
  this.id = Storage.collectionID++;
  this.data = [];
  this.rows = [];
  this.reference = el;
  this.process();
  console.log(this.rows);
}

Collection.prototype = {
  addRow: function (data){
    var row = new CollectionRow();
  },
  removeRow: function (row) {

  },
  compareRow: function (row1, row2) {

  },
  update: function () {
    this.process()
  },
  process: function () {

    // Create rows by data
    var len = this.data.length, i=0, row, obj, elements;
    for (; i < len; i+=1) {
      // Create element by element referenc
      obj = $(this.reference.outerHTML);
      obj.removeAttr('x-foreach');

      // Load the TextNode's
      elements = DOM.loadTextNode(obj[0]);

      // Instantiate new row
      row = new CollectionRow(this.data[i], elements, obj);
      obj.attr('x-cid',this.id);
      obj.attr('x-rid',row.id);
      this.rows.push(row);
    }
  },
  set: function (value) {
      this.data = value;
      this.update();
  }

}
