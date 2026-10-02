Element.implement({
  getClassStoredValue: function (varName) {
    var c = this.get('class').split(' ');
    for (var i = 0; i < c.length; i++) {
      if (c[i].substr(0, c[i].indexOf('-')) == varName) {
        return c[i].substr(c[i].indexOf('-') + 1);
      }
    }
    return null;
  },

  setClassStoredValue: function (varName, varValue) {
    var curValue = this.getClassStoredValue(varName);
    if (curValue) {
      this.removeClass(varName + '-' + curValue);
    }
    this.addClass(varName + '-' + varValue);
  }
});
