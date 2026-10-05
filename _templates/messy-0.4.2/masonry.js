/*
 * Masonry layout for equal width items: each item is placed in the currently shortest column.
 *
 * Vanilla port of the singleMode layout of mooMasonry by Olivier Refalo,
 * a MooTools conversion of jQuery Masonry by David DeSandro. MIT license.
 */
var BertaMasonry = class {
  constructor(element, itemSelector) {
    this.element = element;
    this.itemSelector = itemSelector;

    if (!this.element.querySelector(this.itemSelector)) {
      return;
    }

    this.setup();
    this.arrange();
    window.addEventListener('resize', this.resize.bind(this));
  }

  // Inline style first, computed style as a fallback
  getStyleInt(el, property) {
    return parseInt(el.style[property] || window.getComputedStyle(el)[property], 10);
  }

  setup() {
    this.bricks = Array.from(this.element.querySelectorAll(this.itemSelector));

    var firstBrick = this.bricks[0];
    this.colW = firstBrick.offsetWidth + this.getStyleInt(firstBrick, 'marginLeft') + this.getStyleInt(firstBrick, 'marginRight');

    var width = this.element.offsetWidth + this.getStyleInt(this.element, 'marginLeft') + this.getStyleInt(this.element, 'marginRight');
    this.colCount = Math.max(Math.floor(width / this.colW), 1);
  }

  resize() {
    var lastColCount = this.colCount;
    this.setup();

    if (this.colCount != lastColCount) {
      this.arrange();
    }
  }

  arrange() {
    if (!this.arranged) {
      this.element.style.position = 'relative';
      this.bricks.forEach(function (brick) {
        brick.style.position = 'absolute';
      });
      this.arranged = true;
    }

    // Top left position where the bricks start, relative to the element
    var cursor = document.createElement('div');
    this.element.prepend(cursor);
    var cursorRect = cursor.getBoundingClientRect();
    var elementRect = this.element.getBoundingClientRect();
    var posTop = Math.trunc(cursorRect.top) - Math.trunc(elementRect.top);
    var posLeft = Math.trunc(cursorRect.left) - Math.trunc(elementRect.left);
    cursor.remove();

    var colY = new Array(this.colCount).fill(posTop);

    this.bricks.forEach(function (brick) {
      var shortCol = 0;
      for (var i = 0; i < this.colCount; i++) {
        if (colY[i] < colY[shortCol]) {
          shortCol = i;
        }
      }

      brick.style.top = Math.round(colY[shortCol]) + 'px';
      brick.style.left = Math.round(this.colW * shortCol + posLeft) + 'px';

      colY[shortCol] += brick.offsetHeight + this.getStyleInt(brick, 'marginTop') + this.getStyleInt(brick, 'marginBottom');
    }, this);

    // Wall height is the tallest column
    this.element.style.height = Math.round(Math.max.apply(null, colY) - posTop) + 'px';
  }
};
