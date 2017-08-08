import 'rxjs/add/operator/switchMap';
import { Component, OnInit, HostBinding } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { slideInDownAnimation } from '../utils/animations';

import { Badge, BadgeService }  from '../services/badge.service';

@Component({
  template: `
    <h2>Badges</h2>
    <div *ngIf="badge">
      <h3>"{{ badge.subject }}"</h3>
      <div>
        <label>Id: </label>{{ badge.id }}
      </div>
      <div>
        <label>Name: </label>
        <input [(ngModel)]="badge.subject" placeholder="name"/>
      </div>
      <p>
        <button (click)="gotoBadges()">Back</button>
      </p>
    </div>
  `,
  animations: [ slideInDownAnimation ]
})
export class BadgeDetailComponent implements OnInit {
  @HostBinding('@routeAnimation') routeAnimation = true;
  @HostBinding('style.display')   display = 'block';
  @HostBinding('style.position')  position = 'absolute';

  badge: Badge;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: BadgeService
  ) {}

  ngOnInit() {
    this.route.paramMap
      .switchMap((params: ParamMap) => this.service.getBadge(params.get('id')))
      .subscribe((badge: Badge) => this.badge = badge);
  }

  gotoBadges() {
    let badgeId = this.badge ? this.badge.id : null;
    // Pass along the badge id if available
    // so that the BadgeListComponent can select that badge.
    // Include a junk 'foo' property for fun.
    this.router.navigate(['/badges', { id: badgeId, foo: 'foo' }]);
  }
}
