import 'rxjs/add/operator/switchMap';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { Badge, BadgeService }  from '../services/badge.service';

@Component({
  template: `
    <h2>Badges</h2>
    <ul class="items">
      <li *ngFor="let badge of badges | async"
          [class.selected]="isSelected(badge)"
          (click)="onSelect(badge)">
        <span class="badge">{{ badge.id }}</span> {{ badge.subject }}
      </li>
    </ul>

    <button routerLink="/sidekicks">Go to sidekicks</button>
  `,
  styleUrls: ['./badge-list.component.css']
})
export class BadgeListComponent implements OnInit {
  badges: Observable<Badge[]>;

  private selectedId: number;

  constructor(
    private service: BadgeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.badges = this.route.paramMap
      .switchMap((params: ParamMap) => {
        // (+) before `params.get()` turns the string into a number
        this.selectedId = +params.get('id');
        return this.service.getBadges();
      });
  }

  isSelected(badge: Badge) { return badge.id === this.selectedId; }

  onSelect(badge: Badge) {
    this.router.navigate(['/badge', badge.id]);
  }
}
