// Line model
var CollectionRow = Rinco.CollectionRow = function (data, dom, ref) {
  this.data = data;
  this.dom = dom;
  this.reference = ref;
  this.id = Storage.rowID++;
}
CollectionRow.prototype  = {
  update: function () {

	},
  set: function (val) {

  }

}
