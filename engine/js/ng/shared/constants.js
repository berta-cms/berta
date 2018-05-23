(function(window, document) {
  'use strict';

  window.editables = {
    xEditable: 'xEditable',                     // simple input
    xEditableColor: 'xEditableColor',           // simple input
    xEditableSelect: 'xEditableSelect',         // select
    xEditableSelectRC: 'xEditableSelectRC',     // select
    xEditableFontSelect: 'xEditableFontSelect', // select
    xEditableImage: 'xEditableImage',           // image upload
    xEditableICO: 'xEditableICO',               // ico upload
    xEditableTA: 'xEditableTA',                 // textarea
    xEditableMCE: 'xEditableMCE',               // textarea
    xEditableMCESimple: 'xEditableMCESimple',   // textarea
    xEditableRC: 'xEditableRC',                 // with "real" content
    xEditableYesNo: 'xEditableYesNo',           // the "yes/no" switch
    xEmpty: 'xEmpty'
  };

  window.formats = {
    text: editables.xEditable,
    longtext: editables.xEditableTA,
    richtext: editables.xEditableMCESimple,
    color: editables.xEditableColor,
    image: editables.xEditableImage,
    icon: editables.xEditableICO,
    select: editables.xEditableSelectRC,
    fontselect: editables.xEditableFontSelect
  };

})(window, document);
