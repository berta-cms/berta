/**
 * Aspect ratios for YouTube and Vimeo embeds in browsers whose CSS can't read them
 * from the width/height attributes (no attr() types), see the embed rules in default.css.
 * The ratios go into a stylesheet keyed on those attribute values, never onto the iframes:
 * the editor's inline editing would save an inline style or attribute into the entry.
 */
var BertaEmbedRatios = function () {
  if (window.CSS && CSS.supports('aspect-ratio', 'attr(width type(<number>)) / attr(height type(<number>))')) {
    return;
  }

  var embedSelectors = ['iframe[src*="youtube"]', 'iframe[src*="vimeo"]'];
  var style = document.createElement('style');
  style.id = 'bt-embed-ratios';
  document.head.appendChild(style);

  // one rule per width/height pair, a ratio string like `560 / 315` stands for its pair
  var addedRatios = new Set();

  var addRatios = function () {
    document.querySelectorAll(embedSelectors.join(', ')).forEach(function (iframe) {
      var ratio = window.BertaHelpers.getSizeRatio(iframe);
      if (!ratio || addedRatios.has(ratio)) {
        return;
      }
      addedRatios.add(ratio);

      // plain numbers only (getSizeRatio), safe to put in the selector
      var size = '[width="' + iframe.getAttribute('width') + '"][height="' + iframe.getAttribute('height') + '"]';
      var selector = embedSelectors.map(function (embedSelector) {
        return embedSelector + size;
      }).join(', ');

      style.sheet.insertRule(selector + ' { aspect-ratio: ' + ratio + '; }', style.sheet.cssRules.length);
    });
  };

  addRatios();

  // the editor preview re-renders entries, new embeds need their ratio too
  new MutationObserver(window.BertaHelpers.debounce(addRatios, 100)).observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src', 'width', 'height']
  });
};

window.BertaHelpers.onDomReady(BertaEmbedRatios);
