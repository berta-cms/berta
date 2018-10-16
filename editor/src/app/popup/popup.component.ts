import { Component, OnInit } from '@angular/core';


/*
TODO:
- create popup service with config
- Subscribe to popup data
- create popup types (most popups will contain messages error or success)
- Some popups will contain components
- Add following configuration options for popups:
{
  - hasOverlay: bool
  - isModal: bool
  - type: error|warning|info|success|component
  - component?: Component
  - timeout: miliseconds
  - onTimeout: function
}
*/

@Component({
  selector: 'berta-popup',
  template: `
    <p>
      popup works!
    </p>
  `,
  styles: []
})
export class PopupComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
