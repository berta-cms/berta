Element.implement({
  getIndex: function (type) {
    type = type ? type : "";
    return $$(type).indexOf(this);
  },

  exists: function () {
    return this;
  },

  getClassStoredValue: function (varName) {
    var c = this.get("class").split(" ");
    for (var i = 0; i < c.length; i++) {
      if (c[i].substr(0, c[i].indexOf("-")) == varName) {
        return c[i].substr(c[i].indexOf("-") + 1);
      }
    }
    return null;
  },

  setClassStoredValue: function (varName, varValue) {
    var curValue = this.getClassStoredValue(varName);
    if (curValue) {
      this.removeClass(varName + "-" + curValue);
    }
    this.addClass(varName + "-" + varValue);
  },
});

var BertaEditorBase = new Class({
  Implements: [Options, Events],

  query: null,

  initConsoleReplacement: function () {
    this.query = window.location.search.replace("?", "").parseQueryString();
    if (!window.console) window.console = {};
    if (!window.console.debug) window.console.debug = function () {};
    if (!window.console.error) window.console.error = function () {};
    if (!window.console.log) window.console.log = function () {};
    if (!window.console.info) window.console.info = function () {};
  },

  getEntryInfoForElement: function (el) {
    var retObj = {};

    retObj.site = el.getClassStoredValue("xSite");

    retObj.entryObj = el.getClassStoredValue("xEntryId")
      ? el
      : el.getParent(".xEntry");
    retObj.listObj = el.getClassStoredValue("xSection")
      ? el
      : el.getParent(".xEntriesList");

    // get entryId and entryNum from the entryObj
    retObj.entryId = retObj.entryObj
      ? retObj.entryObj.getClassStoredValue("xEntryId")
      : "";
    retObj.entryNum = retObj.entryObj
      ? retObj.entryObj.getClassStoredValue("xEntryNum")
      : "";

    // try to get section from entryObj, and if not successful — then from listObj
    retObj.section = retObj.entryObj
      ? retObj.entryObj.getClassStoredValue("xSection")
      : "";
    if (!retObj.section)
      retObj.section = retObj.listObj
        ? retObj.listObj.getClassStoredValue("xSection")
        : "";

    return retObj;
  },
});
