import { trigger, state, style, animate, transition } from '@angular/animations';

export const Animations = {
    slideToggle: [
      trigger('isExpanded', [
        state('*', style({
          'height': '0',
        })),
        state('true', style({
          'height': '*',
        })),
        transition('* => *', animate('.25s ease'))
      ])
    ]
};
