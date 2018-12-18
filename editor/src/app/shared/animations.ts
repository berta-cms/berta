import { trigger, state, style, animate, transition } from '@angular/animations';

export const Animations = {
    slideToggle: [
      trigger('isExpanded', [
        state('*', style({
          'height': '0',
          'overflow': 'hidden'
        })),
        state('true', style({
          'height': '*',
          'overflow': 'visible'
        })),
        transition('* => *', animate('.25s ease'))
      ])
    ]
};
