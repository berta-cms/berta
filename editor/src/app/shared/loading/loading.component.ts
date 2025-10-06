import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'berta-loading',
    template: `
    <div class="animation-wrap">
      <svg
        xmlns:dc="http://purl.org/dc/elements/1.1/"
        xmlns:cc="http://creativecommons.org/ns#"
        xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
        xmlns:svg="http://www.w3.org/2000/svg"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 128 128"
        height="128"
        width="128"
        version="1.1"
      >
        <g id="dots-group">
          <path
            style="opacity:0.4;fill:#ffffff;fill-opacity:1;stroke-width:23.49105835"
            d="M 83.000001,64 A 17,17 0 0 0 100,81 17,17 0 0 0 117,64 17,17 0 0 0 100,47 17,17 0 0 0 83.000001,64 Z M 28,47 A 17,17 0 0 0 11,64 17,17 0 0 0 28,81 17,17 0 0 0 45,64 17,17 0 0 0 28,47 Z"
          />
          <path
            style="fill:#000000;fill-opacity:1;stroke-width:21.4183197"
            d="M 84.500003,64.000001 A 15.500001,15.500001 0 0 0 100,79.5 15.500001,15.500001 0 0 0 115.5,64.000001 15.500001,15.500001 0 0 0 100,48.5 15.500001,15.500001 0 0 0 84.500003,64.000001 Z m -41.000003,0 A 15.500001,15.500001 0 0 1 28,79.5 15.500001,15.500001 0 0 1 12.5,64.000001 15.500001,15.500001 0 0 1 28,48.5 15.500001,15.500001 0 0 1 43.5,64.000001 Z"
          />
        </g>
      </svg>
    </div>
  `,
    styles: [
        `
      .animation-wrap {
        position: relative;
        padding-bottom: 100%;
      }
      .animation-wrap svg {
        position: absolute;
        height: 100%;
        width: 100%;
      }
      #dots-group {
        -webkit-animation-name: ckw;
        animation-name: ckw;
        -webkit-animation-duration: 1s;
        animation-duration: 1s;
        -webkit-animation-iteration-count: infinite;
        animation-iteration-count: infinite;
        -webkit-transform-origin: 50% 50%;
        -ms-transform-origin: 50% 50%;
        transform-origin: 50% 50%;
      }
      @-webkit-keyframes ckw {
        0% {
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
        }
        100% {
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
        }
      }
      @keyframes ckw {
        0% {
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
        }
        100% {
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
        }
      }
    `,
    ],
    standalone: false
})
export class LoadingComponent {}
