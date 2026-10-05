var BertaEditorBase = new Class({
  getEntryInfoForElement: function (el) {
    var getValue = window.BertaHelpers.getClassStoredValue;
    var retObj = {};

    retObj.site = getValue(el, "xSite");

    retObj.entryObj = getValue(el, "xEntryId")
      ? el
      : el.getParent(".xEntry");
    retObj.listObj = getValue(el, "xSection")
      ? el
      : el.getParent(".xEntriesList");

    // get entryId and entryNum from the entryObj
    retObj.entryId = retObj.entryObj
      ? getValue(retObj.entryObj, "xEntryId")
      : "";
    retObj.entryNum = retObj.entryObj
      ? getValue(retObj.entryObj, "xEntryNum")
      : "";

    // try to get section from entryObj, and if not successful — then from listObj
    retObj.section = retObj.entryObj
      ? getValue(retObj.entryObj, "xSection")
      : "";
    if (!retObj.section)
      retObj.section = retObj.listObj
        ? getValue(retObj.listObj, "xSection")
        : "";

    return retObj;
  },
});
