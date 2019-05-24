import { animate, style, transition, trigger } from '@angular/animations';

export const SlideUpDown = {
  animationTrigger: trigger('slideUpDown', [
    transition(':enter', [
      style({ height: 0 }),
      animate('0.3s ease-in', style({ height: '*' }))
    ]),
    transition(':leave', [
      animate('0.3s ease-out', style({ height: 0 }))
    ])
  ])
};
