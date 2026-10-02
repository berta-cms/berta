var BertaEditorBase = new Class({
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
