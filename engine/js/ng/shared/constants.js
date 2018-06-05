(function(window) {
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
    text: window.editables.xEditable,
    longtext: window.editables.xEditableTA,
    richtext: window.editables.xEditableMCESimple,
    color: window.editables.xEditableColor,
    image: window.editables.xEditableImage,
    icon: window.editables.xEditableICO,
    select: window.editables.xEditableSelectRC,
    fontselect: window.editables.xEditableFontSelect
  };

})(window);
