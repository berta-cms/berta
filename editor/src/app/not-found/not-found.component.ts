import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'berta-not-found',
  template: `
    <div class="bt-not-found">
      <h3>404</h3>
      <p>Not found</p>
    </div>
  `,
  styles: []
})
export class NotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
