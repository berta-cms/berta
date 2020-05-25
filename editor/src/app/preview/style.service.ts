import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StyleService {
  styleSheet: CSSStyleSheet;

  initializeStyleSheet(styleSheet: CSSStyleSheet) {
    this.styleSheet = styleSheet;
  }

  updateStyle(styleToChange) {
  }
}
