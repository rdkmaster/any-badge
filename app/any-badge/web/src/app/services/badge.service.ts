import {Injectable} from '@angular/core';

export class Badge {
  constructor(public id: number,
              public subject: string,
              public status: string,
              public color: string,
              public descriptioin: string) {
  }
}

const badges = [
  new Badge(11, 'Mr. Nice', '123', 'red', 'desc'),
  new Badge(12, 'Narco', '123', 'red', 'desc'),
  new Badge(13, 'Bombasto', '123', 'red', 'desc'),
  new Badge(14, 'Celeritas', '123', 'red', 'desc'),
  new Badge(15, 'Magneta', '123', 'red', 'desc'),
  new Badge(16, 'RubberMan', '123', 'red', 'desc')
];

let badgesPromise = Promise.resolve(badges);

@Injectable()
export class BadgeService {
  getBadges() {
    return badgesPromise;
  }

  getBadge(id: number | string) {
    return badgesPromise
    // (+) before `id` turns the string into a number
      .then(badges => badges.find(badge => badge.id === +id));
  }
}
