import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {filter, map, Subscription, tap} from 'rxjs';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {ScheduleService} from '../../../schedule/services/schedule.service';
import {MatDatepickerInputEvent} from '@angular/material/datepicker';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public title = '';
  public selectedDate = new FormControl();
  public selectedGenres = new FormControl();
  public genresList$ = this.scheduleService.genresList$;

  private subscriptions = new Subscription();
  constructor(private readonly router: Router,
              private readonly scheduleService: ScheduleService) {
  }

  ngOnInit(): void {
    this.initRouterEventsSubscription();
    this.initSelectedDateSubscription();
    this.initSelectedGenresFormValueChangesSubscription();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public changeSelectedDate(event: MatDatepickerInputEvent<Date>): void {
    if (!event.value) {
      return;
    }
    this.selectedGenres.patchValue([]);
    this.scheduleService.emitSelectedGenres$([]);
    this.scheduleService.emitSelectedDate$(event.value);
  }

  private initRouterEventsSubscription(): void {
    this.subscriptions.add(
      this.router.events
        .pipe(
          filter((event) => event instanceof NavigationEnd),
          map(() => {
            let route: ActivatedRoute = this.router.routerState.root;
            let routeTitle = '';
            while (route!.firstChild) {
              route = route.firstChild;
            }
            if (route.snapshot.data['title']) {
              routeTitle = route!.snapshot.data['title'];
            }
            if (!this.router.routerState.snapshot.url.includes('/schedule')) {
              this.selectedDate.disable();
              this.selectedGenres.disable();
            } else {
              this.selectedDate.enable();
              this.selectedGenres.enable();
            }
            return routeTitle;
          })
        )
        .subscribe((title: string) => {
          if (title) {
            this.title = title;
          }
        })
    );
  }

  private initSelectedDateSubscription(): void {
    this.subscriptions.add(
      this.scheduleService.selectedDate$
        .pipe(
          tap((date: Date) => this.selectedDate.patchValue(date)),
        )
        .subscribe()
    );
  }

  private initSelectedGenresFormValueChangesSubscription(): void {
    this.subscriptions.add(
      this.selectedGenres.valueChanges.subscribe((selected: string[]) => {
        this.scheduleService.emitSelectedGenres$(selected)
      })
    );
  }

}
